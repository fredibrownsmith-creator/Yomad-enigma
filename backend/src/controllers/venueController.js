const prisma = require('../db/prisma');

const venueInclude = {
  owner: { select: { id: true, name: true, avatar: true } },
  reviews: { include: { user: { select: { id: true, name: true, avatar: true } } } }
};

exports.getAllVenues = async (req, res) => {
  try {
    const venues = await prisma.venue.findMany({ where: { isActive: true }, include: venueInclude });
    res.json(venues);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.searchVenues = async (req, res) => {
  try {
    const { city, country, minCapacity, maxPrice } = req.query;
    const venues = await prisma.venue.findMany({
      where: {
        isActive: true,
        ...(city        && { city:         { contains: city,    mode: 'insensitive' } }),
        ...(country     && { country:      { contains: country, mode: 'insensitive' } }),
        ...(minCapacity && { capacity:     { gte: parseInt(minCapacity) } }),
        ...(maxPrice    && { pricePerHour: { lte: parseFloat(maxPrice) } })
      },
      include: venueInclude
    });
    res.json(venues);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getVenueById = async (req, res) => {
  try {
    const venue = await prisma.venue.findUnique({ where: { id: req.params.id }, include: venueInclude });
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    res.json(venue);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createVenue = async (req, res) => {
  try {
    const venue = await prisma.venue.create({
      data: {
        ...req.body,
        ownerId:   req.user.id,
        equipment: req.body.equipment || [],
        amenities: req.body.amenities || [],
        photos:    req.body.photos    || []
      },
      include: venueInclude
    });
    res.status(201).json(venue);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateVenue = async (req, res) => {
  try {
    const venue = await prisma.venue.findUnique({ where: { id: req.params.id } });
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    if (venue.ownerId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
    const updated = await prisma.venue.update({ where: { id: req.params.id }, data: req.body, include: venueInclude });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteVenue = async (req, res) => {
  try {
    const venue = await prisma.venue.findUnique({ where: { id: req.params.id } });
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    if (venue.ownerId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
    await prisma.venue.delete({ where: { id: req.params.id } });
    res.json({ message: 'Venue deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1–5' });
    const review = await prisma.review.create({
      data: { rating: parseInt(rating), comment, userId: req.user.id, venueId: req.params.id },
      include: { user: { select: { id: true, name: true, avatar: true } } }
    });
    res.status(201).json(review);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getVenueReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { venueId: req.params.id },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
