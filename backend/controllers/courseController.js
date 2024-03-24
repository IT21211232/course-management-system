// controllers/courseController.js
const Course = require('../models/Course');

// Adding a new course - this function can only be performed by an admin
async function addCourse(req, res, next) {
    const crscode = req.body.crscode;
    const crsname = req.body.crsname;
    const description = req.body.description;
    const credit = Number(req.body.credit);
    const faculty = req.body.faculty;
    const check = null;
    if(req.user.role === 'admin'){
        try {
            // Check if a course with the same crscode alrady exists
            const existingCourse = await Course.findOne({ crscode });
            if (existingCourse) {
                return res.status(400).json({ error: "Course with the same crscode already exists" });
            }
    
            // If the course does not exist, create and save the new course
            const courseItem = new Course({
                crscode,
                crsname,
                description,
                credit,
            });
    
            await courseItem.save();
            return res.json({ status: "Course successfully added!" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: "Error with adding course" });
        }
    }
    else{
        return res.status(401).json({ error: "You are not authorized to perform this action" });
    }
    
}

/*Function for getting all the courses available*/
async function getAllCourses(req, res) {
    try {
        const courseItems = await Course.find();
        res.json(courseItems);
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: `Cannot fetch course details at the moment. Err: ${err}` });
    }
}

// this function can be performed by an admin or a faculty member from the respective faclty
async function updateCourse(req, res) {
    const { crscode } = req.params;
    const { crsname, description, credit } = req.body;
    const facultyDetails = await Course.findOne({crscode});
    let facultyName;
    if(facultyDetails){
        facultyName = facultyDetails.faculty;
    }
    else{
        return res.status(404).json({ error: "Course with provided code not found" });
    }

    if((req.user.role === 'faculty' && req.user.username === facultyName) || req.user.role === 'admin'){
        try {
            // Find the menu course by crscode and update it
            const updatedItem = await Course.findOneAndUpdate(
                { crscode },
                { $set: { crsname, description, credit } },
                { new: true } // Return the updated document
            );
    
            if (updatedItem) {
                return res.status(200).json({ status: "Item updated", updatedItem });
            } else {
                return res.status(404).json({ error: "Course with provided code not found" });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    else{
        return res.status(401).json({ error: "You are not authorized to perform this action" });
    }

    
}

// Once the course is created, the admin can allocate faculties for the courses
async function updateFaculty (req, res, next) {
    if(req.user.role === 'admin'){

        try {
            const { crscode } = req.params;
            const { faculty } = req.body;
    
            // Find the course by crscode and update the faculty value
            const updatedCourse = await Course.findOneAndUpdate(
                { crscode: crscode },
                { $set: { faculty: faculty } },
                { new: true } // Return the updated document
            );
    
            if (updatedCourse) {
                return res.status(200).json({ status: "Faculty updated successfully", updatedCourse });
            } else {
                return res.status(404).json({ error: "Course with provided crscode not found" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal server error" });
        }

    }
    else{
        return res.status(401).json({ error: "You are not authorized to perform this action" });
    }
};

// the function below can only be performed by an admin or the respective faculty
async function deleteCourse(req, res) {
    const { crscode } = req.params;
    const facultyDetails = await Course.findOne({crscode});
    let facultyName;
    if(facultyDetails){
        facultyName = facultyDetails.faculty;
    }
    else{
        return res.status(404).json({ error: "Course with provided code not found" });
    }

    if((req.user.role === 'faculty' && req.user.username === facultyName) || req.user.role === 'admin'){
        try {
            // Find the menu item by name and delete it
            const deletedItem = await Course.findOneAndDelete({ crscode });
    
            if (deletedItem) {
                return res.status(200).json({ status: "Item deleted", deletedItem });
            } else {
                return res.status(404).json({ error: "Course with the entered code not found" });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    else{
        return res.status(401).json({ error: "You are not authorized to perform this action" });
    }
}

module.exports = { addCourse, updateCourse, updateFaculty, deleteCourse, getAllCourses};