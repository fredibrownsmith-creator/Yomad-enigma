const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/venueController');

router.get('/',              ctrl.getAllVenues);
router.get('/search',        ctrl.searchVenues);
router.get('/:id',           ctrl.getVenueById);
router.post('/',             auth, ctrl.createVenue);
router.put('/:id',           auth, ctrl.updateVenue);
router.delete('/:id',        auth, ctrl.deleteVenue);
router.post('/:id/reviews',  auth, ctrl.addReview);
router.get('/:id/reviews',   ctrl.getVenueReviews);

module.exports = router;
