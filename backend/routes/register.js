const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/registerController');

// Route for user registration
router.post('/add', registerUser);

module.exports = router;