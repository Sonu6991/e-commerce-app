import { describe, expect, it, jest } from "@jest/globals";
import authController from "../../controllers/authController";
import User from "../../models/userModel";

// Mocking the dependencies
jest.mock('../../models/userModel', () => ({
    findOne: jest.fn(),
}));

describe('login', () => {
    it('should return success message for valid user and password', (done: any) => {
        const req = { body: { email: 'sonu@yopmail.com', password: 'Sonu@123' } };
        const res = {
            // status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn().mockImplementation((key, value, options) => { })
        };
        const next = jest.fn()
        const mockUser = {
            // @ts-ignore
            comparePassword: jest.fn().mockResolvedValue(true),
            incrementLoginCount: jest.fn().mockImplementation(() => { }),
            // @ts-ignore
            generateAuthToken: jest.fn().mockResolvedValue('token')
        }
        // @ts-ignore
        User.findOne.mockResolvedValue(mockUser)

        // @ts-ignore
        authController.login(req, res, next).then(() => {
            expect(mockUser.comparePassword).toHaveBeenCalledWith('Sonu@123')
            expect(res.json).toHaveBeenCalledWith({ message: 'Login Success', status: 1 });
            done()
        }).catch((err: any) => {
            done(err)
        });

    });

    it('should return 400 with error message for invalid user', (done: any) => {
        const req = { body: { email: 'fsf@yopmail.com', password: 'Sonu@123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn()

        // @ts-ignore
        User.findOne.mockResolvedValue(null);

        // @ts-ignore
        authController.login(req, res, next).then(() => {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid user" });
            done()
        }).catch((err: any) => {
            done(err)
        });
    });

    it('should return 401 with error message for incorrect username or password', (done) => {
        const req = { body: { email: 'sonu@yopmail.com', password: 'xyz@123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn()

        const mockUser = {
            // @ts-ignore
            comparePassword: jest.fn().mockResolvedValue(false)
        };

        // @ts-ignore
        User.findOne.mockResolvedValue(mockUser)

        // @ts-ignore
        authController.login(req, res, next).then(() => {
            expect(User.findOne).toHaveBeenCalledWith({ email: "sonu@yopmail.com" });
            expect(mockUser.comparePassword).toHaveBeenCalledWith('xyz@123');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
            done()
        }).catch((err: any) => {
            done(err)
        });
    });

    it('should return 500 with error message for server error', async () => {
        const req = { body: { email: 'sonu@yopmail.com', password: 'xyz@123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // @ts-ignore

        User.findOne.mockRejectedValue(new Error('Some error occurred'));

        const next = jest.fn();
        // @ts-ignore
        authController.login(req, res, next).then(() => {
            expect(User.findOne).toHaveBeenCalledWith({ email: 'sonu@yopmail.com' });
            expect(next).toHaveBeenCalledWith(new Error('Some error occurred'));
        })

    });
});
