
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
    // the body is passed empty to get equivalent results
    req.body = {};

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(errorHandler(400, 'Make sure all the fields are filled'));
  });

  it('If the user is not found an error message needs to be returned', async () => {
    req.body = { username: 'ip21211232', password: 'Tester432' };
    User.findOne.mockResolvedValue(null);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(errorHandler(404, 'User not found'));
  });

  it('Fir invalid passwords it needs to respond with an error message', async () => {
    req.body = { username: 'it21211232', password: 'password' };
    User.findOne.mockResolvedValue({ password: 'hashedPassword' });
    bcrypt.compareSync.mockReturnValue(false);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(errorHandler(400, 'Invalid username or password'));
  });

  it('should handle errors thrown during execution', async () => {
    req.body = { username: 'it21211232', password: 'password' };
    User.findOne.mockRejectedValue(new Error('Database error'));

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('Database error'));
  });
});