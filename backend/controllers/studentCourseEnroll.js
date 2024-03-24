// controllers/courseController.js
const CourseStudent = require('../models/CourseStudent');
const StudentCourse = require('../models/StudentCourse');
const Course = require('../models/Course')

async function getEnrolledStudents(req, res, next){
    if(req.user.role === 'admin'){
        try {
            const allEnrollments = await CourseStudent.find();
            return res.status(200).json(allEnrollments);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: `Cannot fetch enrolled courses. Err: ${err}` });
        }
    }
    else{
        return res.status(401).json({ error: "You are not authorized to perform this action." });
    }
}

async function addCourseToStudent(req, res, next){
    const crscode = req.body.crscode;
    const studentID = req.user.username;
    try {
        // Check if a document already exists for the studentID
        let student = await StudentCourse.findOne({ studentID });
        let course = await Course.findOne({ crscode });

        let courseAdded = await CourseStudent.findOne({ crscode });

        if(course){
            if (student) {
                // Check if the student is already enrolled in the course
                if (student.coursesEnrolled.includes(crscode)) {
                    return res.status(401).json({ error: "You are already enrolled in this course" });
                } else {
                    // Add the course to the enrolled courses array
                    // student.coursesEnrolled.push(crscode); -- not working
                    await StudentCourse.updateOne(
                        { studentID: studentID },
                        { $push: { coursesEnrolled: crscode } }
                    );

                    /*Code responsible in adding the data to the course-students collection.*/
                    if(courseAdded){
                        await CourseStudent.updateOne(
                            { crscode: crscode },
                            { $push: { studentsEnrolled: studentID } }
                        );
                    }
                    else{
                        course = new CourseStudent({
                            crscode,
                            studentsEnrolled: [studentID]
                        });
                        await course.save();
                    }
                    return res.status(200).json({ message: "Successfully enrolled to module" });
                }
            } else {
                // Create a new document for the student if it doesn't exist
                student = new StudentCourse({
                    studentID,
                    coursesEnrolled: [crscode]
                });
                await student.save();

                /*Code responsible in adding the data to the course-students collection.*/
                if(courseAdded){
                    await CourseStudent.updateOne(
                        { crscode: crscode },
                        { $push: { studentsEnrolled: studentID } }
                    );
                }
                else{
                    course = new CourseStudent({
                        crscode,
                        studentsEnrolled: [studentID]
                    });
                    await course.save();
                }
                return res.status(200).json({ message: "Successfully enrolled to module" });
            }


        }
        else{
            return res.status(401).json({ error: "There is no course available with the entered course ID" });
        }

        

        // Save the updated or new student document
        
        // return "Enrollment successful";
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong!" });
    }
}

async function enrollUnenrollMe(req, res, next) {
    if(req.user.role === 'student'){
        addCourseToStudent(req, res, next);
        // addStudentToCourse(req, res, next);
    }
    else{
        return res.status(401).json({ error: "Only students are allowed to enroll to courses" });
    }
}

async function unenrollStudent(req, res, next, studentID ,crscode){
    try {
        // Validate if the studentID exists in the StudentCourse collection
        const student = await StudentCourse.findOne({ studentID });
        if (!student) {
            return res.status(404).json({ error: `Student with ID ${studentID} not found` });
        }

        // Remove the crscode from the coursesEnrolled array
        const updatedCoursesEnrolled = student.coursesEnrolled.filter(course => course !== crscode);
        student.coursesEnrolled = updatedCoursesEnrolled;
        await student.save();

        // Validate if the crscode exists in the CourseStudent collection
        const course = await CourseStudent.findOne({ crscode });
        if (!course) {
            return res.status(404).json({ error: `Course with code ${crscode} not found` });
        }

        // Remove the studentID from the studentsEnrolled array
        const updatedStudentsEnrolled = course.studentsEnrolled.filter(student => student !== studentID);
        course.studentsEnrolled = updatedStudentsEnrolled;
        await course.save();

        res.status(200).json({ message: `Course ${crscode} removed from student ${studentID}, and student ${studentID} removed from course ${crscode}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function unenrollMe(req, res, next){
    if(req.user.role === 'student'){
        const studentID = req.user.username;
        const crscode = req.body.crscode;
        unenrollStudent(req, res, next, studentID, crscode);
    }
    else{
        return res.status(401).json({ error: "You are not authorized to perform this action." });
    }
}

async function adminUnenrollStudent(req, res, next){
    if(req.user.role == 'admin'){
        const studentID = req.body.username;
        const crscode = req.body.coursecode;
        unenrollStudent(req, res, next, studentID, crscode);
    }
    else{
        return res.status(401).json({ error: "You are not authorized to perform this action." });
    }
}

module.exports = { getEnrolledStudents, enrollUnenrollMe, unenrollMe, adminUnenrollStudent };