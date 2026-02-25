const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/messageController');

router.get('/inbox',     auth, ctrl.getInbox);
router.get('/:userId',   auth, ctrl.getConversation);

module.exports = router;
