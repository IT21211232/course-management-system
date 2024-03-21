const express = require('express');
const router = express.Router();
const {addClass} = require('../controllers/timetableController');

router.post('/add', addClass);

module.exports = router;