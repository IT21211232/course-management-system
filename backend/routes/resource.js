const express = require('express');
const router = express.Router();
const { addResource } = require('../controllers/resourceController');
const { authUser } = require('../utils/authUser');

router.post('/add', authUser, addResource);

module.exports = router;