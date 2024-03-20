// controllers/courseController.js
const CourseStudent = require('../models/CourseStudent');
const StudentCourse = require('../models/StudentCourse');
const Course = require('../models/Course')

async function addCourseToStudent(req, res, next){
    const crscode = req.body.crscode;
    const studentID = req.user.username;
    try {
        // Check if a document already exists for the studentID
        let student = await StudentCourse.findOne({ studentID });
        let course = await Course.findOne({ crscode });

        if(course){
            if (student) {
                // Check if the student is already enrolled in the course
                if (student.coursesEnrolled.includes(crscode)) {
                    return res.status(401).json({ error: "You are already enrolled in this course" });
                } else {
                    // Add the course to the enrolled courses array
                    // student.coursesEnrolled.push(crscode);
                    await StudentCourse.updateOne(
                        { studentID: studentID },
                        { $push: { coursesEnrolled: crscode } }
                    );
                    return res.status(200).json({ message: "Successfully enrolled to module" });
                }
            } else {
                // Create a new document for the student if it doesn't exist
                student = new StudentCourse({
                    studentID,
                    coursesEnrolled: [crscode]
                });
                await student.save();
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

// async function addStudentToCourse(req, res, next){
//     const crscode = req.body.crscode;
//     const studentID = req.user.username;
//     try {
//         // Check if a document already exists for the studentID
//         let course = await CourseStudent.findOne({ crscode });

//         if (course) {
//             // Check if the student is already enrolled in the course
//             if (course.studentsEnrolled.includes(studentID)) {
//                 return res.status(401).json({ error: "You are already enrolled in this course" });
//             } else {
//                 // Add the course to the enrolled courses array
//                 // student.coursesEnrolled.push(crscode);
//                 await StudentCourse.updateOne(
//                     { crscode: crscode },
//                     { $push: { studentsEnrolled: studentID } }
//                 );
//                 return res.status(200).json({ message: "Successfully enrolled to module" });
//             }
//         } else {
//             // Create a new document for the student if it doesn't exist
//             course = new CourseStudent({
//                 crscode,
//                 studentsEnrolled: [studentID]
//             });
//             await course.save();
//             return res.status(200).json({ message: "Successfully enrolled to module" });
//         }

//         // Save the updated or new student document
        
//         // return "Enrollment successful";
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Something went wrong!" });
//     }
// }

async function enrollUnenrollMe(req, res, next) {
    if(req.user.role === 'student'){
        addCourseToStudent(req, res, next);
        // addStudentToCourse(req, res, next);
    }
    else{
        return res.status(401).json({ error: "Only students are allowed to enroll to courses" });
    }
}

module.exports = { enrollUnenrollMe };