const prisma = require('../db/prisma');

const memberSelect = {
  id: true, name: true, avatar: true, bio: true, languages: true,
  location: true, country: true, yogaStyles: true,
  certifications: true, isVerified: true, yearsExperience: true
};

exports.getMembers = async (req, res) => {
  try {
    const { language, country, yogaStyle } = req.query;
    const members = await prisma.user.findMany({
      where: {
        id: { not: req.user.id },
        ...(language  && { languages:  { has: language  } }),
        ...(yogaStyle && { yogaStyles: { has: yogaStyle } }),
        ...(country   && { country: { contains: country, mode: 'insensitive' } })
      },
      select: memberSelect
    });
    res.json(members);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getMemberById = async (req, res) => {
  try {
    const member = await prisma.user.findUnique({ where: { id: req.params.id }, select: memberSelect });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.sendConnection = async (req, res) => {
  try {
    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { userId: req.user.id,    connectedId: req.params.id },
          { userId: req.params.id,  connectedId: req.user.id   }
        ]
      }
    });
    if (existing) return res.status(400).json({ error: 'Connection already exists' });
    const connection = await prisma.connection.create({
      data: { userId: req.user.id, connectedId: req.params.id }
    });
    res.status(201).json(connection);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getConnections = async (req, res) => {
  try {
    const connections = await prisma.connection.findMany({
      where: {
        status: 'accepted',
        OR: [{ userId: req.user.id }, { connectedId: req.user.id }]
      },
      include: {
        user:      { select: memberSelect },
        connected: { select: memberSelect }
      }
    });
    res.json(connections);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getPendingConnections = async (req, res) => {
  try {
    const pending = await prisma.connection.findMany({
      where: { connectedId: req.user.id, status: 'pending' },
      include: { user: { select: memberSelect } }
    });
    res.json(pending);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateConnectionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const connection = await prisma.connection.update({ where: { id: req.params.id }, data: { status } });
    res.json(connection);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
