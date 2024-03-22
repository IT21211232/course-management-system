const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    course: { type: String, required: true },
    type: { type: String, required: true },
    addedTime: { type: Date, required: true },
})

const Notification = mongoose.model("notification", notificationSchema)

module.exports = Notification;