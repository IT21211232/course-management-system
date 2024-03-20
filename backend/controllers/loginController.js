const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Register');
const {errorHandler} = require('../utils/error')

async function login(req, res, next) {
    const { username, password } = req.body;

    if(!username || !password || username === '' || password === ''){
        next(errorHandler(400, 'All fields are required'));
    }

    try {
        const validUser = await User.findOne({username});
        if(!validUser){
            next(errorHandler(404, 'User not found'));
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(400, 'Invalid username or password'))
        }

        const token = jwt.sign(
            {
                username: validUser.username, role: validUser.role
            },
            process.env.JWT_SECRET
        )

        const {password: pass, ...nopassword } = validUser._doc;

        res.status(200).cookie('session_data', token, {
            httpOnly: true
        }).json(nopassword);

    } catch (error) {
        console.log(error);
        next(error)
    }
    // try {
    //     // Check if user exists
    //     const user = await User.findOne({ username });
    //     if (!user) {
    //         return res.status(404).json({ error: "User not found" });
    //     }

    //     // Check if password is correct
    //     const validPassword = await bcrypt.compare(password, user.password);
    //     if (!validPassword) {
    //         return res.status(401).json({ error: "Invalid password" });
    //     }

    //     // Generate JWT token
    //     const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET);
    //     res.json({ token });
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ error: "Internal server error" });
    // }
}

module.exports = { login };