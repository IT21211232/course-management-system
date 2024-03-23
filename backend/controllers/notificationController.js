const Notification = require('../models/Notification');
const Course = require('../models/Course')
const StudentCourse = require('../models/StudentCourse')
const router = require('../routes/course');

async function getNotifications(req, res, next){
    if(req.user.role == 'admin' || req.user.role == 'faculty'){
        try {
            const allNotifs = await Notification.find();
            return res.status(200).json(allNotifs);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: `Cannot fetch notifications at the moment. Err: ${err}` });
        }
    }
    else if(req.user.role === 'student'){
        try {
            let username = req.user.username;
            let studentCourse = await StudentCourse.findOne({ studentID: username });
            let coursesArray = studentCourse.coursesEnrolled;

            if (coursesArray && coursesArray.length > 0) {
                const studentNotifs = await Notification.find({ course: { $in: coursesArray } });
                res.status(200).json(studentNotifs);
            } else {
                res.status(404).json({state: 'There are no notifications/special announcements at the moment'});
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: `Cannot fetch messages at the moment. Err: ${err}` });
        }
    }
}

module.exports = {getNotifications};