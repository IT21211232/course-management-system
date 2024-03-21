const express = require('express');
const router = express.Router();
const {addClass, updateClass} = require('../controllers/timetableController');
const {authUser} = require('../utils/authUser');

router.post('/add', authUser, addClass);
router.put('/update/:classID', authUser, updateClass);

module.exports = router;