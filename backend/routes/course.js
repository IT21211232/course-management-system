const router = require("express").Router();
let Course = require("../models/Course.js");

router.route("/add").post(async (req, res) => {
    const crscode = req.body.crscode;
    const crsname = req.body.crsname;
    const description = req.body.description;
    const credit = Number(req.body.credit);

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
});

router.route("/update/:crscode").put(async (req, res) => {
    const crscode = req.params.crscode;
    const { crsname, description, credit } = req.body;

    try {
        // Find the menu course by crscode and update it
        const updatedItem = await Course.findOneAndUpdate(
            { crscode: crscode },
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
});

router.route("/").get((req, res) => {
    Course.find().then((courseItems)=>{
        res.json(courseItems);
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: `Cannot fetch course details at the moment. Err: ${err}`});
    })
})

router.route("/delete/:crscode").delete(async (req, res) => {
    const crscode = req.params.crscode;

    try {
        // Find the menu item by name and delete it
        const deletedItem = await Course.findOneAndDelete({ crscode: crscode });

        if (deletedItem) {
            return res.status(200).json({ status: "Item deleted", deletedItem });
        } else {
            return res.status(404).json({ error: "Course with the entered ID not found" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;

