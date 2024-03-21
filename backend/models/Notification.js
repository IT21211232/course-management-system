const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    crscode: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    addedTime: { type: Date, required: true },
})

const Timetable = mongoose.model("timetable", timetableSchema)

module.exports = Timetable;