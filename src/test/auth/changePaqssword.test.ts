import { afterEach, describe, expect, it, jest } from "@jest/globals";
import authController from "../../controllers/authController";
import User from "../../models/userModel";


// Mocking the dependencies
jest.mock('../../models/userModel', () => ({

    findByIdAndUpdate: jest.fn()
}));


describe('signup', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return 400 with error message for bad request', async () => {
        const req = { body: { password: '', passwordConfirm: '', } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const next = jest.fn();
        // @ts-ignore

        await authController.changePassword(req, res, next);

        expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(new Error('Bad request'));
    });
})