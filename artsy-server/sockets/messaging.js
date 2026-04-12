// Socket.io handler for real-time messaging.
//
// Authentication: every incoming connection must carry the httpOnly session
// cookie. We verify it the same way the Express middleware does — via Firebase
// Admin — then attach the MySQL userId to the socket for the rest of its life.
//
// Room strategy: each authenticated user joins the room "user:<userId>".
// When a message is saved we emit "new_message" into both participants' rooms
// so the recipient receives it in real time regardless of which page they are on.

const { admin } = require("../utils/firebaseAdmin");
const usersModel = require("../models/users");
const messagesModel = require("../models/messages");

const MAX_MESSAGE_LENGTH = 2000;

// Parse a specific cookie value from the raw Cookie header string.
function parseSessionCookie(cookieHeader) {
  if (!cookieHeader) return null;
  for (const pair of cookieHeader.split(";")) {
    const [key, ...rest] = pair.trim().split("=");
    if (key.trim() === "session") return decodeURIComponent(rest.join("="));
  }
  return null;
}

function registerSocketHandlers(io) {
  // --- Auth middleware — runs before every connection is accepted ---
  io.use(async (socket, next) => {
    try {
      const sessionCookie = parseSessionCookie(socket.handshake.headers.cookie);
      if (!sessionCookie) return next(new Error("No session cookie"));

      const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
      const dbUser = await usersModel.getUserByFirebaseUid(decoded.uid);
      if (!dbUser) return next(new Error("User not found in database"));

      socket.userId = dbUser.userId; // available for the lifetime of this socket
      next();
    } catch {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    // Join a private room so we can address this user from anywhere on the server.
    socket.join(`user:${userId}`);

    // --- send_message ---
    // Payload: { conversationId: number, content: string }
    socket.on("send_message", async ({ conversationId, content }) => {
      try {
        if (!content || typeof content !== "string" || content.trim().length === 0) {
          return socket.emit("message_error", { message: "Message cannot be empty" });
        }
        if (content.length > MAX_MESSAGE_LENGTH) {
          return socket.emit("message_error", {
            message: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`,
          });
        }

        const isAllowed = await messagesModel.isParticipant(conversationId, userId);
        if (!isAllowed) {
          return socket.emit("message_error", { message: "Not a participant in this conversation" });
        }

        const messageId = await messagesModel.saveMessage(
          conversationId,
          userId,
          content.trim(),
        );

        const participants = await messagesModel.getConversationParticipants(conversationId);
        const recipientId =
          participants.userAId === userId ? participants.userBId : participants.userAId;

        const messageData = {
          messageId,
          conversationId,
          senderId: userId,
          content: content.trim(),
          createdAt: new Date().toISOString(),
        };

        // Emit to sender (confirmation) and recipient (real-time delivery).
        io.to(`user:${userId}`).emit("new_message", messageData);
        io.to(`user:${recipientId}`).emit("new_message", messageData);
      } catch (err) {
        console.error("send_message Error:", err);
        socket.emit("message_error", { message: "Failed to send message" });
      }
    });

    // --- mark_read ---
    // Payload: { conversationId: number }
    socket.on("mark_read", async ({ conversationId }) => {
      try {
        await messagesModel.markConversationRead(conversationId, userId);

        const participants = await messagesModel.getConversationParticipants(conversationId);
        if (participants) {
          const otherId =
            participants.userAId === userId ? participants.userBId : participants.userAId;
          // Tell the other user their messages have been read (useful for future read receipts).
          io.to(`user:${otherId}`).emit("messages_read", { conversationId });
        }
      } catch (err) {
        console.error("mark_read Error:", err);
      }
    });
  });
}

module.exports = registerSocketHandlers;
