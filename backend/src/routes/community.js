const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/communityController');

router.get('/members',           auth, ctrl.getMembers);
router.get('/members/:id',       auth, ctrl.getMemberById);
router.post('/connect/:id',      auth, ctrl.sendConnection);
router.get('/connections',       auth, ctrl.getConnections);
router.get('/pending',           auth, ctrl.getPendingConnections);
router.put('/connections/:id',   auth, ctrl.updateConnectionStatus);

module.exports = router;
