const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const registerSchema = new Schema({
    username: { type: String, required: true, unique: true }, // This needs to act as the ID because the ID cannot be repeated
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['student'], default: 'student' }
})

const Register = mongoose.model("register", registerSchema)

module.exports = Register;