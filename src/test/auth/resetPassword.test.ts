import { afterEach, describe, expect, it, jest } from "@jest/globals";
import authController from "../../controllers/authController";
import User from "../../models/userModel";
import Token from "../../models/tokenModel";
import * as bcrypt from 'bcryptjs'


// Mocking the dependencies
jest.mock('../../models/userModel', () => ({
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn()
}));
jest.mock('../../models/tokenModel', () => ({
    findOne: jest.fn(),
    deleteOne: jest.fn(),
    create: jest.fn()
}));
jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    hash: jest.fn()
}));

describe('signup', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should return 400 with error message for Invalid or expired password reset token", async () => {

        const req = { body: { userId: '1234', token: '', password: '1234@1234', } }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        // @ts-ignore
        User.findOne.mockResolvedValue(null)
        // @ts-ignore
        await authController.resetPassword(req, res, next)
        expect(Token.findOne).toHaveBeenCalledWith({ userId: req.body.userId })
        expect(next).toHaveBeenCalledWith(new Error('Expired password reset token'));
    })
    it("should return 404 with error message for token mismatch", async () => {
        const req = { body: { userId: '1234', token: '1234@121314', password: '1234@1234', } }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        // @ts-ignore
        Token.findOne.mockResolvedValue({ token: "1234@121314" })
        // @ts-ignore
        bcrypt.compare.mockResolvedValue(false)
        // @ts-ignore
        bcrypt.hash.mockResolvedValue('1234@121314')
        // @ts-ignore
        await authController.resetPassword(req, res, next)
        expect(Token.findOne).toHaveBeenCalledWith({ userId: req.body.userId })
        expect(next).toHaveBeenCalledWith(new Error('Invalid or expired password reset token'));
    })

    it("should return success mesaage for reset Password Reset Successfully", async () => {

        const req = { body: { userId: '42434', token: '1234@121314', password: '1234@1234', } }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        // @ts-ignore
        Token.findOne.mockResolvedValue({ token: "1234@121314", deleteOne: jest.fn() })
        // @ts-ignore
        bcrypt.compare.mockResolvedValue(true)

        const mockHash = {
            password: 'xyz@123456'
        }
        // @ts-ignore
        bcrypt.hash.mockResolvedValue(mockHash.password)

        // @ts-ignore
        User.findByIdAndUpdate.mockResolvedValue({ _id: '42434', firstName: 'sonu', lastName: 'chauhan', email: 'sonu@yopmail.com', role: ['customer'], address: '123 Main St', password: "1234@asdA" })

        // @ts-ignore
        await authController.resetPassword(req, res, next)
        expect(Token.findOne).toHaveBeenCalledWith({ userId: req.body.userId })
        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.token, '1234@121314')
        expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, expect.anything())
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(req.body.userId, expect.objectContaining({ password: mockHash.password }), expect.anything())
        expect(res.json).toHaveBeenCalledWith({
            message: "Password Reset Successfully",
            user: expect.anything()
        });
    })
})