import { io } from "socket.io-client";
let socket = null;

export const initSocket = (url = "http://localhost:5000") => {
  if (!socket) {
    socket = io(url, { transports: ["websocket"] });
  }
  return socket;
};

export const getSocket = () => socket;

export const cleanupSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};