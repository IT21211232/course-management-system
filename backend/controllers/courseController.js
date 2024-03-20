// controllers/courseController.js
const Course = require('../models/Course');

async function addCourse(req, res, next) {
    const crscode = req.body.crscode;
    const crsname = req.body.crsname;
    const description = req.body.description;
    const credit = Number(req.body.credit);

    console.log(req.user.role);
    if(req.user.role === 'admin'){
        try {
            // Check if a course with the same crscode already exists
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

async function getAllCourses(req, res) {
    try {
        const courseItems = await Course.find();
        res.json(courseItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: `Cannot fetch course details at the moment. Err: ${err}` });
    }
}

async function updateCourse(req, res) {
    const { crscode } = req.params;
    const { crsname, description, credit } = req.body;

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
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function deleteCourse(req, res) {
    const { crscode } = req.params;

    try {
        // Find the menu item by name and delete it
        const deletedItem = await Course.findOneAndDelete({ crscode });

        if (deletedItem) {
            return res.status(200).json({ status: "Item deleted", deletedItem });
        } else {
            return res.status(404).json({ error: "Course with the entered code not found" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { addCourse, updateCourse, deleteCourse, getAllCourses };