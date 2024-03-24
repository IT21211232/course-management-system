// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {enrollUnenrollMe, unenrollMe, adminUnenrollStudent} = require('../controllers/studentCourseEnroll');
const { authUser } = require('../utils/authUser');

router.post('/enroll', authUser, enrollUnenrollMe);
router.post('/unenroll', authUser, unenrollMe)
router.post('/unenrollstudent', authUser, adminUnenrollStudent)

module.exports = router;