import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Update with your backend URL if deployed

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // Ensures a stable connection
  withCredentials: true, // Allow authentication cookies if needed
});

export default socket;
