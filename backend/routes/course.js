const express = require('express');
const router = express.Router();
const { addCourse, updateCourse, getAllCourses, deleteCourse } = require('../controllers/courseController');
const { authUser } = require('../utils/authUser');

router.post('/add', authUser, addCourse);
router.put('/update/:crscode', updateCourse);
router.get('/', getAllCourses);
router.delete('/delete/:crscode', deleteCourse);

module.exports = router;

