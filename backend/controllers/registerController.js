const bcrypt = require('bcryptjs');
const User = require('../models/Register');

async function registerUser(req, res) {
    const { username, password, name } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hashing the password for better security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
            name,
            role: 'student' // Newly registered users are set as students by default
        });

        // Save the new user to the database
        await newUser.save();
        
        return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { registerUser };