import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000", {
// const socket: Socket = io("https://sisiku-backend.vercel.app", {
  // withCredentials: true,
});

export default socket;
