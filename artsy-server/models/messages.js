// Messages model — all raw DB access for the messaging system.
// Functions:
// A. findOrCreateConversation  — get or create a conversation between two users
// B. getConversationsForUser   — inbox: all conversations with preview + unread count
// C. getMessagesByConversation — full message history (verifies participant first)
// D. saveMessage               — insert a message and bump lastMessageAt
// E. markConversationRead      — mark all incoming messages as read
// F. deleteConversation        — hard-delete messages then conversation (participant only)
// G. isParticipant             — auth helper: is this user in this conversation?
// H. getConversationParticipants — return userAId/userBId for socket routing

const mysql2 = require("mysql2");
const dbconfig = require("../utils/dbconfig");
const pool = mysql2.createPool(dbconfig).promise();

class MessagesModel {
  // Enforce consistent ordering so (3,7) and (7,3) always map to the same row.
  _orderedPair(idA, idB) {
    return idA < idB ? [idA, idB] : [idB, idA];
  }

  // A. Return existing conversationId, or create one and return its new id.
  async findOrCreateConversation(userAId, userBId) {
    const [a, b] = this._orderedPair(userAId, userBId);
    try {
      const [existing] = await pool.query(
        `SELECT conversationId FROM conversations WHERE userAId = ? AND userBId = ?`,
        [a, b],
      );
      if (existing.length > 0) return existing[0].conversationId;

      const [result] = await pool.query(
        `INSERT INTO conversations (userAId, userBId) VALUES (?, ?)`,
        [a, b],
      );
      return result.insertId;
    } catch (err) {
      console.error("findOrCreateConversation Error:", err);
      throw err;
    }
  }

  // B. Inbox: all conversations for a user, sorted newest first.
  //    Each row includes the other user's info, last message preview, and unread count.
  async getConversationsForUser(userId) {
    try {
      const [rows] = await pool.query(
        `SELECT
           c.conversationId,
           c.lastMessageAt,
           IF(c.userAId = ?, c.userBId, c.userAId)   AS otherUserId,
           u.userName                                 AS otherUserName,
           u.avatarUrl                                AS otherUserAvatar,
           (SELECT content
              FROM messages
             WHERE conversationId = c.conversationId
             ORDER BY createdAt DESC
             LIMIT 1)                                 AS lastMessage,
           (SELECT COUNT(*)
              FROM messages
             WHERE conversationId = c.conversationId
               AND senderId != ?
               AND isRead = 0)                        AS unreadCount
         FROM conversations c
         JOIN users u ON u.userId = IF(c.userAId = ?, c.userBId, c.userAId)
         WHERE c.userAId = ? OR c.userBId = ?
         ORDER BY c.lastMessageAt DESC`,
        [userId, userId, userId, userId, userId],
      );
      return rows;
    } catch (err) {
      console.error("getConversationsForUser Error:", err);
      throw err;
    }
  }

  // C. Full message history for a conversation. Returns null if not a participant.
  async getMessagesByConversation(conversationId, requestingUserId) {
    try {
      const allowed = await this.isParticipant(conversationId, requestingUserId);
      if (!allowed) return null;

      const [messages] = await pool.query(
        `SELECT m.messageId, m.senderId, m.content, m.isRead, m.createdAt,
                u.userName AS senderName, u.avatarUrl AS senderAvatar
           FROM messages m
           JOIN users u ON u.userId = m.senderId
          WHERE m.conversationId = ?
          ORDER BY m.createdAt ASC`,
        [conversationId],
      );
      return messages;
    } catch (err) {
      console.error("getMessagesByConversation Error:", err);
      throw err;
    }
  }

  // D. Insert a message row and update the conversation's lastMessageAt timestamp.
  async saveMessage(conversationId, senderId, content) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        `INSERT INTO messages (conversationId, senderId, content) VALUES (?, ?, ?)`,
        [conversationId, senderId, content],
      );

      await connection.query(
        `UPDATE conversations SET lastMessageAt = NOW() WHERE conversationId = ?`,
        [conversationId],
      );

      await connection.commit();
      return result.insertId;
    } catch (err) {
      await connection.rollback();
      console.error("saveMessage Error:", err);
      throw err;
    } finally {
      connection.release();
    }
  }

  // E. Mark all unread messages in a conversation as read (only messages from the other user).
  async markConversationRead(conversationId, userId) {
    try {
      await pool.query(
        `UPDATE messages
            SET isRead = 1
          WHERE conversationId = ? AND senderId != ? AND isRead = 0`,
        [conversationId, userId],
      );
    } catch (err) {
      console.error("markConversationRead Error:", err);
      throw err;
    }
  }

  // F. Delete all messages then the conversation row. Returns false if not a participant.
  async deleteConversation(conversationId, userId) {
    const allowed = await this.isParticipant(conversationId, userId);
    if (!allowed) return false;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(`DELETE FROM messages WHERE conversationId = ?`, [conversationId]);
      await connection.query(`DELETE FROM conversations WHERE conversationId = ?`, [conversationId]);
      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      console.error("deleteConversation Error:", err);
      throw err;
    } finally {
      connection.release();
    }
  }

  // G. Check whether a user is a participant in a conversation.
  async isParticipant(conversationId, userId) {
    try {
      const [rows] = await pool.query(
        `SELECT conversationId
           FROM conversations
          WHERE conversationId = ? AND (userAId = ? OR userBId = ?)`,
        [conversationId, userId, userId],
      );
      return rows.length > 0;
    } catch (err) {
      console.error("isParticipant Error:", err);
      throw err;
    }
  }

  // H. Return userAId and userBId so the socket handler knows who to notify.
  async getConversationParticipants(conversationId) {
    try {
      const [rows] = await pool.query(
        `SELECT userAId, userBId FROM conversations WHERE conversationId = ?`,
        [conversationId],
      );
      return rows[0] || null;
    } catch (err) {
      console.error("getConversationParticipants Error:", err);
      throw err;
    }
  }
}

module.exports = new MessagesModel();
