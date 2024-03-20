const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseStudentSchema = new Schema({
    crscode: {
        type : String,
        required : true
    },
    studentsEnrolled: {
        type: [String],
        default: []
    }
})

const CourseStudent = mongoose.model("courseStudent", courseStudentSchema) 

module.exports = CourseStudent;