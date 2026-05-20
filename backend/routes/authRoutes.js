//authRoutes.js
const express = require('express');

const { registerUser, loginUser } = require('../controllers/AuthController');

const router = express.Router();

//route to register a user
router.post('/register', registerUser);

//route to login
router.post('/login', loginUser);

module.exports = router;