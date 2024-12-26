import { io, Socket } from "socket.io-client";

// const socket: Socket = io("http://localhost:3000", {
// const socket: Socket = io("https://sisiku-backend.vercel.app", {
const socket: Socket = io("https://api.trobits.com", {
  withCredentials: true,
});

export default socket;
