import { io } from 'socket.io-client';
import { API_BASE } from '../api/client';

let socket = null;

export const connectSocket = (token) => {
  if (socket) socket.disconnect();
  socket = io(API_BASE, { auth: { token } });
  return socket;
};

export const getSocket       = ()  => socket;
export const disconnectSocket = () => { if (socket) socket.disconnect(); };
