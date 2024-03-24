const { addResource } = require('../controllers/resourceController');
const Resource = require('../models/Resource');

describe('Resource Controller', () => {
    describe('addResource', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                user: {
                    role: 'admin'
                },
                body: {
                    name: 'Sample Resource',
                    description: 'This is a sample resource description'
                }
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            next = jest.fn();
        });

        it('should add a resource if user is admin', async () => {
            Resource.prototype.save = jest.fn();

            await addResource(req, res, next);

            expect(Resource.prototype.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ status: 'Resource successfully added!' });
        });

        it('should return error if user is not admin', async () => {
            req.user.role = 'student';

            await addResource(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'You are not authorized to add resources' });
        });

        // Add more test cases for different scenarios as needed
    });
});