const prisma = require('../db/prisma');

exports.getAllOffers = async (req, res) => {
  try {
    const { category } = req.query;
    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        ...(category && { category }),
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }]
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(offers);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOfferById = async (req, res) => {
  try {
    const offer = await prisma.offer.findUnique({ where: { id: req.params.id } });
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    res.json(offer);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createOffer = async (req, res) => {
  try {
    const offer = await prisma.offer.create({ data: req.body });
    res.status(201).json(offer);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
