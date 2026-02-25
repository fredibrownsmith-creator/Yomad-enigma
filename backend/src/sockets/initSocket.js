const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma');

module.exports = function (io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(socket.user.id); // Each user joins their own private room

    socket.on('sendMessage', async ({ receiverId, content }) => {
      if (!receiverId || !content) return;
      try {
        const message = await prisma.message.create({
          data: { content, senderId: socket.user.id, receiverId },
          include: { sender: { select: { id: true, name: true, avatar: true } } }
        });
        io.to(receiverId).emit('newMessage', message);     // Deliver to receiver
        io.to(socket.user.id).emit('newMessage', message); // Echo back to sender
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('typing', ({ receiverId }) => {
      io.to(receiverId).emit('userTyping', { userId: socket.user.id });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });
};
