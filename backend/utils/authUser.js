const jwt = require('jsonwebtoken');
const {errorHandler} = require('../utils/error.js')

const authUser = (req, res, next) => {
    const token = req.cookies.session_data;
    if(!token){
        return next(errorHandler(401, 'Unauthorized'))
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return next(errorHandler(401, 'Unauthorized'));
        }
        req.user = user;
        next();
    });

  };

module.exports = {authUser}