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
}

module.exports = { login };