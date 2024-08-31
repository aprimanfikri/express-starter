const express = require('express');
const auth = require('./auth');

const router = express.Router();

router.use('/api/v1/auth', auth);

module.exports = router;
