const { getNotifications } = require('../controllers/notificationController');
const Notification = require('../models/Notification');
const StudentCourse = require('../models/StudentCourse');

describe('Notification Controller', () => {
    describe('getNotifications', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                user: {
                    role: 'admin',
                    username: 'admin123'
                }
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            next = jest.fn();
        });

        it('should get all notifications for admin', async () => {
            const allNotifications = [{ course: 'CSE101', type: 'announcement', addedTime: new Date() }];
            Notification.find = jest.fn().mockResolvedValue(allNotifications);

            await getNotifications(req, res, next);

            expect(Notification.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(allNotifications);
        });

        it('should get student-specific notifications for student', async () => {
            req.user.role = 'student';
            const coursesArray = ['CSE101', 'MAT102']; 
            const studentNotifs = [{ course: 'CSE101', type: 'announcement', addedTime: new Date() }];
            StudentCourse.findOne = jest.fn().mockResolvedValue({ coursesEnrolled: coursesArray });
            Notification.find = jest.fn().mockResolvedValue(studentNotifs);

            await getNotifications(req, res, next);

            expect(StudentCourse.findOne).toHaveBeenCalledWith({ studentID: req.user.username });
            expect(Notification.find).toHaveBeenCalledWith({ course: { $in: coursesArray } });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(studentNotifs);
        });

        // Add more test cases for different scenarios as needed
    });
});