import { afterEach, describe, expect, it, jest } from "@jest/globals";
import authController from "../../controllers/authController";
import User from "../../models/userModel";
import Token from "../../models/tokenModel";

// Mocking the dependencies
jest.mock('../../models/userModel', () => ({
    findOne: jest.fn(),
}));
jest.mock('../../models/tokenModel', () => ({
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    create: jest.fn()
}));

describe('signup', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should return 400 with error message for email required", async () => {

        const req = { body: { email: '' } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        // @ts-ignore
        await authController.forgotPassword(req, res, next)
        expect(User.findOne).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(new Error('email required!'));
    })
    it("should return 404 with error message for user does not exists", async () => {

        const req = { body: { email: 'sonu@yopmail.com' } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        // @ts-ignore
        User.findOne.mockResolvedValue(null)
        // @ts-ignore
        await authController.forgotPassword(req, res, next)
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User does not exist" });
    })

    it("should return success mesaage for reset password token generated and valid for 10 min", async () => {

        const req = { body: { email: 'sonu@yopmail.com' } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();

        // @ts-ignore
        User.findOne.mockResolvedValue({ _id: '42434', firstName: 'sonu', lastName: 'chauhan', email: 'sonu@yopmail.com', role: ['customer'], address: '123 Main St', password: "1234@asdA" });
        Token.findOne.mockResolvedValue(null);

        // @ts-ignore
        await authController.forgotPassword(req, res, next)
        expect(Token.create).toHaveBeenCalledWith(expect.objectContaining({
            userId: '42434'
        }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "reset password token valid for 10 min"
        }));
    })
})