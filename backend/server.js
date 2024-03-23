//assigning variables and importing the dependencies installed
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require('cookie-parser')

//Routes
app.get("/", (req, res) => {
    res.send("Home Page");
})

//defining the port numbers (if 8070 is not available, assign any available port number)
const PORT = process.env.PORT || 8070;

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

//connecting the database
const URL = process.env.MONGODB_URL;
//mongoDB configurations
mongoose.connect(URL, {
    
});

// Importing and accessing the course.js route file
const courseRouter = require("./routes/course.js")
// using the imported route
app.use("/course", courseRouter);

// Importing and accessing the register.js route file
const registerRouter = require("./routes/register.js")
// using the imported route
app.use("/signup", registerRouter);

// Importing and accessing the login.js route file
const loginRouter = require("./routes/login.js")
// using the imported route
app.use("/signin", loginRouter);

// Importing and accessing the studentcourseenroll.js route file
const courseEnrollmentRouter = require("./routes/studentcourseenroll.js")
// using the imported route
app.use("/enroll", courseEnrollmentRouter);

// Importing and accessing the studentcourseenroll.js route file
const timetableRouter = require("./routes/timetable.js")
// using the imported route
app.use("/class", timetableRouter);

// Importing and accessing the notification.js route file
const notificationsRouter = require("./routes/notification.js")
// using the imported route
app.use("/notifications", notificationsRouter);

// Importing and accessing the notification.js route file
const resourceRouter = require("./routes/resource.js")
// using the imported route
app.use("/resource", resourceRouter);


//creating the connection
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB Connection Successful")
})

//run this in the port
app.listen(PORT, () => {
    console.log(`Server is up and running on port number ${PORT}`)
})