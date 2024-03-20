const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studentCourseSchema = new Schema({
    studentID: {
        type : String,
        required : true
    },
    coursesEnrolled: {
        type: [String],
        default: []
    }
})

const StudentCourse = mongoose.model("studentCourse", studentCourseSchema) 

module.exports = StudentCourse;