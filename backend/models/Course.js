const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    crscode: {
        type : String,
        required : true
    },
    crsname: {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    credit: {
        type : Number,
        required : true
    },
    faculty: {
        type: String,
        default: null
    }
})

const Course = mongoose.model("course", courseSchema) // "Course" is the name of the table

module.exports = Course;