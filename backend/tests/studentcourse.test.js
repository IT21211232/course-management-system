const { getEnrolledStudents, enrollUnenrollMe, unenrollMe } = require('../controllers/studentCourseEnroll');
const StudentCourse = require('../models/StudentCourse');
const CourseStudent = require('../models/CourseStudent');
const Course = require('../models/Course');

describe('Student Course Enrollment Controller', () => {
    describe('getEnrolledStudents', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                user: {
                    role: 'admin'
                }
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            next = jest.fn();
        });

        // it('should return all enrolled students if user is admin', async () => {
        //     StudentCourse.find = jest.fn().mockResolvedValue([{ studentID: 'student1', coursesEnrolled: ['course1', 'course2'] }]);

        //     await getEnrolledStudents(req, res, next);

        //     expect(res.status).toHaveBeenCalledWith(200);
        //     expect(res.json).toHaveBeenCalledWith([{ studentID: 'student1', coursesEnrolled: ['course1', 'course2'] }]);
        // });

        it('should return error if user is not admin', async () => {
            req.user.role = 'student';

            await getEnrolledStudents(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to perform this action.' });
        });
    });
});