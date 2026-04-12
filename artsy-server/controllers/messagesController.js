// Messages controller — HTTP handlers for the REST messaging endpoints.
// Functions:
// A. startConversation  — POST /messages/conversations
// B. getInbox           — GET  /messages/conversations
// C. getConversation    — GET  /messages/conversations/:conversationId
// D. deleteConversation — DELETE /messages/conversations/:conversationId

const messagesModel = require("../models/messages");

const MAX_MESSAGE_LENGTH = 2000;

// A. Start or reopen a conversation with another user.
async function startConversation(req, res) {
  try {
    const currentUser = await resolveDbUser(req, res);
    if (!currentUser) return;

    const targetUserId = parseInt(req.body.targetUserId, 10);
    if (!targetUserId || isNaN(targetUserId)) {
      return res.status(400).json({ error: "targetUserId is required" });
    }
    if (targetUserId === currentUser.userId) {
      return res.status(400).json({ error: "You cannot message yourself" });
    }

    const conversationId = await messagesModel.findOrCreateConversation(
      currentUser.userId,
      targetUserId,
    );
    res.json({ conversationId });
  } catch (err) {
    console.error("startConversation Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// B. Inbox — all conversations for the logged-in user, newest first.
async function getInbox(req, res) {
  try {
    const currentUser = await resolveDbUser(req, res);
    if (!currentUser) return;

    const conversations = await messagesModel.getConversationsForUser(currentUser.userId);
    res.json(conversations);
  } catch (err) {
    console.error("getInbox Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// C. Open a conversation — returns all messages and marks them as read.
async function getConversation(req, res) {
  try {
    const currentUser = await resolveDbUser(req, res);
    if (!currentUser) return;

    const conversationId = parseInt(req.params.conversationId, 10);
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: "Invalid conversationId" });
    }

    const messages = await messagesModel.getMessagesByConversation(
      conversationId,
      currentUser.userId,
    );
    if (messages === null) {
      return res.status(403).json({ error: "Not a participant in this conversation" });
    }

    await messagesModel.markConversationRead(conversationId, currentUser.userId);

    res.json(messages);
  } catch (err) {
    console.error("getConversation Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// D. Delete a conversation and all its messages (participant only, confirmation in UI).
async function deleteConversation(req, res) {
  try {
    const currentUser = await resolveDbUser(req, res);
    if (!currentUser) return;

    const conversationId = parseInt(req.params.conversationId, 10);
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: "Invalid conversationId" });
    }

    const deleted = await messagesModel.deleteConversation(conversationId, currentUser.userId);
    if (!deleted) {
      return res.status(403).json({ error: "Not a participant in this conversation" });
    }

    res.json({ message: "Conversation deleted" });
  } catch (err) {
    console.error("deleteConversation Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Helper: look up the MySQL user row from the Firebase uid on req.user.
// Sends a 404 response and returns null if the user is not found.
async function resolveDbUser(req, res) {
  const usersModelInstance = require("../models/users");
  const dbUser = await usersModelInstance.getUserByFirebaseUid(req.user.uid);
  if (!dbUser) {
    res.status(404).json({ error: "User not found" });
    return null;
  }
  return dbUser;
}

module.exports = { startConversation, getInbox, getConversation, deleteConversation };
