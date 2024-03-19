//assigning variables and importing the dependencies installed
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();

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

//connecting the database
const URL = process.env.MONGODB_URL;
//mongoDB configurations
mongoose.connect(URL, {
    
});

// Importing and accessing the course.js route file
const courseRouter = require("./routes/course.js")
// using the imported route
app.use("/course", courseRouter);


//creating the connection
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB Connection Successful")
})

//run this in the port
app.listen(PORT, () => {
    console.log(`Server is up and running on port number ${PORT}`)
})