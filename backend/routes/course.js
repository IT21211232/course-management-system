const express = require('express');
const router = express.Router();
const { addCourse, updateCourse, getAllCourses, deleteCourse, updateFaculty } = require('../controllers/courseController');
const { authUser } = require('../utils/authUser');

router.post('/add', authUser, addCourse);
router.put('/update/:crscode', authUser, updateCourse);
router.put('/update/faculty/:crscode', authUser,updateFaculty);
router.get('/', authUser, getAllCourses);
router.delete('/delete/:crscode', authUser, deleteCourse);

module.exports = router;

