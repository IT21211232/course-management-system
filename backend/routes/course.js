const router = require("express").Router();
let Course = require("../models/Course.js");

router.route("/add").post((req, res) => {
    const crscode = req.body.crscode;
    const crsname = req.body.crsname;
    const description = req.body.description;
    const credit = Number(req.body.credit);

    const courseItem = new Course({
        crscode,
        crsname,
        description,
        credit,
    })

    courseItem.save().then(() => {
        res.json({status: "Course successfully added!"});
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: "Error with adding course"});
    });
})

router.route("/").get((req, res) => {
    Course.find().then((courseItems)=>{
        res.json(courseItems);
    }).catch((err) => {
        console.log(err);
        res.status(500).send({status: `Cannot fetch course details at the moment. Err: ${err}`});
    })
})

module.exports = router;

