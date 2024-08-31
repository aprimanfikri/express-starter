const express = require('express');
const { register, login, get } = require('../controllers/auth');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/me', authenticate, get);
router.post('/register', register);
router.post('/login', login);

module.exports = router;
