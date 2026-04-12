// Singleton socket.io-client instance.
//
// autoConnect: false — the socket only connects once the user is authenticated.
// AuthContext calls socket.connect() after a successful session check and
// socket.disconnect() on logout, so the connection lifetime mirrors the session.
//
// withCredentials: true — the browser forwards the httpOnly session cookie on
// the WebSocket upgrade handshake, which is how the server authenticates the socket.

import { io } from "socket.io-client";

const socket = io("http://localhost:3005", {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
