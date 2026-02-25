const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/offerController');

router.get('/',     auth, ctrl.getAllOffers);
router.get('/:id',  auth, ctrl.getOfferById);
router.post('/',    auth, ctrl.createOffer);

module.exports = router;
