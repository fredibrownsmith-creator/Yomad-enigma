const express = require('express');
const router = express.Router();

router.use('/auth',      require('./auth'));
router.use('/venues',    require('./venues'));
router.use('/community', require('./community'));
router.use('/offers',    require('./offers'));
router.use('/messages',  require('./messages'));

module.exports = router;
