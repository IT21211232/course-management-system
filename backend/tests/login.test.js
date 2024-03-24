
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { login } = require('../controllers/loginController');
const User = require('../models/Register');
const { errorHandler } = require('../utils/error');

// Mock the modules
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/Register');
jest.mock('../utils/error');

describe('Login Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), cookie: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should respond with an error if username or password is missing', async () => {
    req.body = {}; // Empty body

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(errorHandler(400, 'Make sure all the fields are filled'));
  });

  it('an error message has to be returned if the user is not found', async () => {
    req.body = { username: 'ip21211232', password: 'Tester432' };
    User.findOne.mockResolvedValue(null);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(errorHandler(404, 'User not found'));
  });

  it('should respond with an error if password is invalid', async () => {
    req.body = { username: 'it21211232', password: 'password' };
    User.findOne.mockResolvedValue({ password: 'hashedPassword' });
    bcrypt.compareSync.mockReturnValue(false);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(errorHandler(400, 'Invalid username or password'));
  });

//   it('should log in successfully and respond with user data', async () => {
//     req.body = { username: 'it21211232', password: 'Tester432' };
//     const mockUser = { _doc: { username: 'it21211232', role: 'student', name: 'Student01' } };
//     User.findOne.mockResolvedValue(mockUser);
//     bcrypt.compareSync.mockReturnValue(true);
//     jwt.sign.mockReturnValue('mockedToken');

//     await login(req, res, next);

//     expect(jwt.sign).toHaveBeenCalledWith(
//       { username: 'it21211232', role: 'student' },
//       process.env.JWT_SECRET
//     );
//     expect(res.cookie).toHaveBeenCalledWith('session_data', 'mockedToken', { httpOnly: true });
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({ username: 'it21211232', role: 'student', name: 'Student01' });
//   });
    

    // it('should log in successfully and respond with user data', async () => {
    //     const req = { body: { username: 'it21211232', password: 'Tester432' } };
    //     const res = { 
    //     status: jest.fn().mockReturnThis(), 
    //     json: jest.fn(), 
    //     cookie: jest.fn() 
    //     };
    //     const next = jest.fn();
        
    //     const mockUser = { 
    //     _doc: { username: 'it21211232', role: 'student', name: 'Student01' } 
    //     };
        
    //     // Mocking User.findOne
    //     User.findOne.mockResolvedValue(mockUser);
        
    //     // Mocking bcrypt.compareSync
    //     bcrypt.compareSync.mockReturnValue(true);
        
    //     // Mocking jwt.sign
    //     jwt.sign.mockReturnValue('mockedToken');
    
    //     await login(req, res, next);
    
    //     // Expectations
    //     expect(User.findOne).toHaveBeenCalledWith({ username: 'it21211232' });
    //     expect(bcrypt.compareSync).toHaveBeenCalledWith('Tester432', mockUser._doc.password);
    //     expect(jwt.sign).toHaveBeenCalledWith(
    //     { username: 'it21211232', role: 'student' },
    //     process.env.JWT_SECRET
    //     );
    //     expect(res.cookie).toHaveBeenCalledWith('session_data', 'mockedToken', { httpOnly: true });
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith(mockUser._doc);
    // });
    

  it('should handle errors thrown during execution', async () => {
    req.body = { username: 'it21211232', password: 'password' };
    User.findOne.mockRejectedValue(new Error('Database error'));

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('Database error'));
  });
});