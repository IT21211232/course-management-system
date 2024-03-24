// tests/courseController.test.js
const { addCourse, updateCourse, updateFaculty, deleteCourse, getAllCourses } = require('../controllers/courseController');
const Course = require('../models/Course');

// Mocking dependencies
jest.mock('../models/Course');

describe('Course Controller', () => {
  describe('addCourse', () => {
    it('should add a new course', async () => {
      const req = { body: { crscode: 'CSE101', crsname: 'Introduction to Computer Science', description: 'A course introducing fundamentals of computer science', credit: 3 }, user: { role: 'admin' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const next = jest.fn();
      Course.findOne.mockResolvedValue(null);
      Course.prototype.save.mockResolvedValueOnce({ _id: '606ebfc734ff184aa0c39e1a', crscode: 'CSE101', crsname: 'Introduction to Computer Science', description: 'A course introducing fundamentals of computer science', credit: 3 });

      await addCourse(req, res, next);

      expect(Course.findOne).toHaveBeenCalledWith({ crscode: 'CSE101' });
      expect(Course.prototype.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ status: "Course successfully added!" });
    });

    it('should return an error if course with the same crscode already exists', async () => {
      const req = { body: { crscode: 'CSE101', crsname: 'Introduction to Computer Science', description: 'A course introducing fundamentals of computer science', credit: 3 }, user: { role: 'admin' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const next = jest.fn();
      Course.findOne.mockResolvedValue({ _id: '606ebfc734ff184aa0c39e1a', crscode: 'CSE101' });

      await addCourse(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Course with the same crscode already exists" });
    });

  
    it('should return an error if user is not admin', async () => {
        const req = { body: { crscode: 'CSE101', crsname: 'Introduction to Computer Science', description: 'A course introducing fundamentals of computer science', credit: 3 }, user: { role: 'student' } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const next = jest.fn();
      
        await addCourse(req, res, next);
      
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "You are not authorized to perform this action" });
      });
    
  });

  describe('getAllCourses', () => {
    it('should get all courses', async () => {
      const req = {};
      const res = { json: jest.fn() };

      Course.find.mockResolvedValue([{ _id: '606ebfc734ff184aa0c39e1a', crscode: 'CSE101', crsname: 'Introduction to Computer Science', description: 'A course introducing fundamentals of computer science', credit: 3 }]);

      await getAllCourses(req, res);

      expect(res.json).toHaveBeenCalledWith([{ _id: '606ebfc734ff184aa0c39e1a', crscode: 'CSE101', crsname: 'Introduction to Computer Science', description: 'A course introducing fundamentals of computer science', credit: 3 }]);
    });

    it('should handle errors', async () => {
      const req = {};
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      Course.find.mockRejectedValue(new Error('Database error'));

      await getAllCourses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ status: "Cannot fetch course details at the moment. Err: Error: Database error" });
    });

    it('should handle course not found', async () => {
        const req = { params: { crscode: 'CS101' }, body: { crsname: 'Updated Course', description: 'Updated Description', credit: 3 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        Course.findOneAndUpdate.mockResolvedValueOnce(null);
  
        await updateCourse(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Course with provided code not found' });
      });
  
      it('should handle internal server error', async () => {
        const req = { params: { crscode: 'CS101' }, body: { crsname: 'Updated Course', description: 'Updated Description', credit: 3 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        Course.findOneAndUpdate.mockRejectedValueOnce(new Error('Database error'));
  
        await updateCourse(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      });

      it('should delete a course', async () => {
        const req = { params: { crscode: 'CS101' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        Course.findOneAndDelete.mockResolvedValueOnce({ crscode: 'CS101' });
  
        await deleteCourse(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'Item deleted', deletedItem: { crscode: 'CS101' } });
      });
  
      it('should handle course not found', async () => {
        const req = { params: { crscode: 'CS101' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        Course.findOneAndDelete.mockResolvedValueOnce(null);
  
        await deleteCourse(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Course with the entered code not found' });
      });
  
      it('should handle internal server error', async () => {
        const req = { params: { crscode: 'CS101' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        Course.findOneAndDelete.mockRejectedValueOnce(new Error('Database error'));
  
        await deleteCourse(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
      });
  });

  // Add similar test cases for updateCourse, updateFaculty, and deleteCourse functions
});