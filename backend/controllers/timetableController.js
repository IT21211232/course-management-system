const Timetable = require('../models/Timetable');
const Course = require('../models/Course')
const StudentCourse = require('../models/StudentCourse');
const Notification = require('../models/Notification');

async function getClass(req, res, next) {
    let username = req.user.username;
    if(req.user.role == 'admin' || req.user.role == 'faculty'){
        try {
            const timetableItems = await Timetable.find();
            return res.status(200).json(timetableItems);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: `Cannot fetch timetable at the moment. Err: ${err}` });
        }
    }
    else if(req.user.role == 'student'){
        try {
            let studentCourse = await StudentCourse.findOne({ studentID: username });
            let coursesArray = studentCourse.coursesEnrolled;

            if (coursesArray && coursesArray.length > 0) {
                const timetableEntries = await Timetable.find({ course: { $in: coursesArray } });
                res.status(200).json(timetableEntries);
            } else {
                res.status(404).json({state: 'You have no lectures in the timetable'});
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: `Cannot fetch timetable at the moment. Err: ${err}` });
        }
    }
    else{
        return res.status(400).json({ status: `Please login to continue` });
    }
    
}

async function addClass(req, res, next){
    if(req.user.role === 'faculty'){
        const validDates = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        try {
            const { date, location, course, startTime, endTime } = req.body;
            let simpleDate = date.toLowerCase();

            let courseFac;

            const courseDetails = await Course.findOne({ crscode:course });
            if(courseDetails){
                courseFac = courseDetails.faculty;
            }
            else{
                return res.status(401).json({ error: "No course with the provided code is available" });
            }
            if(courseFac === req.user.username){

                if(validDates.includes(simpleDate)){
                    // Check for overlapping bookings
                    const existingBooking = await Timetable.findOne({
                        date: simpleDate,
                        location: location,
                        $or: [
                            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Check if new time range overlaps with existing booking
                        ]
                    });
    
                    if (existingBooking) {
                        return res.status(400).json({ error: 'Location is already booked during this time period. Book a different location or select a different time period' });
                    }
                    
    
                    // If no overlapping bookings, create and save the new timetable entry
                    const newTimetableEntry = new Timetable({
                        date,
                        location,
                        course,
                        startTime,
                        endTime
                    });
                    await newTimetableEntry.save();

                    const newNotification = new Notification({
                        course,
                        type: 'created',
                        addedTime: new Date()
                    })

                    await newNotification.save();
    
                    res.status(201).json({ message: 'Timetable entry added successfully.' });
                }
                else{
                    return res.status(400).json({ message: 'Enter a valid date' });
                }

            }
            else{
                return res.status(401).json({ message: 'You can only add courses under your faculty' });
            }

            
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error.' });
        }

    }
    else{
        return res.status(401).json({ error: "You are not authorized to perform this action" });
    }
    
}

async function updateClass(req, res, next){
    const { classID } = req.params;
    if(req.user.role === 'faculty'){
        const validDates = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        let prevDate = '';
        let prevLocation = '';
        let prevCourse = '';
        let prevStartTime;
        let prevEndTime;

        const classDetails = await Timetable.findOne({ _id:classID });
        if(classDetails){
            prevDate = classDetails.date;
            prevLocation = classDetails.location;
            prevCourse = classDetails.course;
            prevStartTime = classDetails.startTime;
            prevEndTime = classDetails.endTime;
        }
        else{
            return res.status(404).json({ error: "There is no class with the passed ID" });
        }
        try {
            const { date, location, course, startTime, endTime } = req.body;
            let simpleDate = date.toLowerCase();

            if(simpleDate == prevDate && location == prevLocation && prevCourse == course && prevStartTime == startTime && prevEndTime == endTime){
                return res.status(400).json({ error: "No data has been change, therefore the records are not updated" });
            }
            else{
                /* start of corrected code*/
                let courseFac;

                const courseDetails = await Course.findOne({ crscode:course });
                if(courseDetails){
                    courseFac = courseDetails.faculty;
                }
                else{
                    return res.status(401).json({ error: "No course with the provided code is available" });
                }
                if(courseFac === req.user.username){

                    if(validDates.includes(simpleDate)){
                        // Check for overlapping bookings
                        const existingBooking = await Timetable.findOne({
                            date: simpleDate,
                            location: location,
                            $or: [
                                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Check if new time range overlaps with existing booking
                            ]
                        });
        
                        if (existingBooking) {
                            return res.status(400).json({ error: 'Location is already booked during this time period. Book a different location or select a different time period' });
                        }

                        const updatedEntry = await Timetable.findByIdAndUpdate(classID, {
                            date,
                            location,
                            course,
                            startTime,
                            endTime
                        }, { new: true }); 
                        
                
                        if (updatedEntry) {
                            // If the timetable entry is successfully updated, send a success response
                            const newNotification = new Notification({
                                course,
                                type: 'updated',
                                addedTime: new Date()
                            })
        
                            await newNotification.save();
                            
                            res.status(200).json({ message: 'Timetable entry updated successfully.', updatedEntry });
                        } else {
                            res.status(404).json({ error: 'Timetable entry not found.' });
                        }
                    }
                    else{
                        return res.status(400).json({ message: 'Enter a valid date' });
                    }

                }
                else{
                    return res.status(401).json({ message: 'You can only add courses under your faculty' });
                }

                /* end of corrected code */
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error.' });
        }

    }
    else{
        return res.status(401).json({ error: "You are not authorized to perform this action" });
    }

}

async function deleteClass(req, res, next) {
    if(req.user.role === 'faculty'){
        const { classID } = req.params;
        let course;
        try {
            const classDetails = await Timetable.findOne({ _id:classID });
            if(classDetails){
                course = classDetails.course;
            }
            else{
                return res.status(404).json({ error: "Course with the entered code not found" });
            }

            // Find the menu item by name and delete it
            const deletedItem = await Timetable.findOneAndDelete({ _id: classID });

            if (deletedItem) {
                const newNotification = new Notification({
                    course,
                    type: 'deleted',
                    addedTime: new Date()
                })

                await newNotification.save();

                return res.status(200).json({ status: "Item deleted", deletedItem });


            } else {
                return res.status(404).json({ error: "Course with the entered code not found" });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    else{
        return res.status(401).json({ error: "You are not authorized to perform this action" });
    }
}

module.exports = { getClass ,addClass, updateClass, deleteClass }