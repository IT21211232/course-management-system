const express = require('express');
const router = express.Router();
const {authUser} = require('../utils/authUser');
const {getNotifications} = require('../controllers/notificationController');

router.get('/', authUser, getNotifications);

module.exports = router;