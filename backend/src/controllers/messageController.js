const prisma = require('../db/prisma');

exports.getConversation = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id,      receiverId: req.params.userId },
          { senderId: req.params.userId, receiverId: req.user.id      }
        ]
      },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'asc' }
    });
    await prisma.message.updateMany({
      where: { senderId: req.params.userId, receiverId: req.user.id, read: false },
      data: { read: true }
    });
    res.json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getInbox = async (req, res) => {
  try {
    const sent = await prisma.message.findMany({
      where: { senderId: req.user.id },
      include: { receiver: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      distinct: ['receiverId']
    });
    const received = await prisma.message.findMany({
      where: { receiverId: req.user.id },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      distinct: ['senderId']
    });
    res.json({ sent, received });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
