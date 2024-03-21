const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timetableSchema = new Schema({
    date: { type: String, required: true },
    location: { type: String, required: true },
    course: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
})

const Timetable = mongoose.model("timetable", timetableSchema) 

module.exports = Timetable;