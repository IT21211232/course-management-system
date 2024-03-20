// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {enrollUnenrollMe} = require('../controllers/studentCourseEnroll');
const { authUser } = require('../utils/authUser');

router.post('/enroll', authUser, enrollUnenrollMe);

module.exports = router;