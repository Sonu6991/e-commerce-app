

import { afterEach, describe, expect, it, jest } from "@jest/globals";
import authController from "../../controllers/authController";
import User from "../../models/userModel";


// Mocking the dependencies
jest.mock('../../models/userModel', () => ({
    create: jest.fn(),
}));


describe('signup', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return 201 with success message and user data on successful registration', async () => {
        const req = { body: { firstName: 'sonu', lastName: 'chauhan', email: 'sonu@yopmail.com', role: ['customer'], address: '123 Main St', password: "1234@asdA" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        // @ts-ignore 
        User.create.mockResolvedValue({ _id: '42434', firstName: 'sonu', lastName: 'chauhan', email: 'sonu@yopmail.com', role: ['customer'], address: '123 Main St', password: "1234@asdA" });
        // @ts-ignore

        await authController.signup(req, res, next);

        expect(User.create).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'user registerd.', user: { _id: '42434', firstName: 'sonu', lastName: 'chauhan', email: 'sonu@yopmail.com', role: ['customer'], address: '123 Main St', password: "1234@asdA" } });
    });

    it('should return 400 with error message for bad request', async () => {
        const req = { body: { firstName: '', lastName: '', email: '', password: '', role: '', address: '' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const next = jest.fn();
        // @ts-ignore

        await authController.signup(req, res, next);

        expect(User.create).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(new Error('Bad request'));
    });


    it('should return 400 with error message for server error', async () => {
        const req = { body: { firstName: 'sonu', lastName: 'chauhan', email: 'sonu@yopmail.com', role: ['customer'], address: '123 Main St', password: "1234@asdA" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        // @ts-ignore
        User.create.mockRejectedValue(new Error('Some error occurred'));
        // @ts-ignore

        await authController.signup(req, res, next);
        // @ts-ignore
        expect(User.create).toHaveBeenCalledWith(req.body);
        expect(next).toHaveBeenCalledWith(new Error('Some error occurred'));

    });
});