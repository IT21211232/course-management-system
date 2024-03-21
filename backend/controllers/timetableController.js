const Timetable = require('../models/Timetable');
const Course = require('../models/Course')

async function addClass(req, res, next){
    const validDates = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    try {
        const { date, location, course, startTime, endTime } = req.body;
        let simpleDate = date.toLowerCase();

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

            res.status(201).json({ message: 'Timetable entry added successfully.' });
        }
        else{
            return res.status(400).json({ message: 'Enter a valid date' });
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

async function updateClass(){
    
}

module.exports = {addClass}