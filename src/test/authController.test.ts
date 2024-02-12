import { describe, expect, it, jest } from "@jest/globals";
import authController from "../controllers/authController";
import User from "../models/userModel";



describe('login', () => {
    it('should return success message for valid user and password', (done: any) => {
        const req = { body: { email: 'sonu@yopmail.com', password: 'Sonu@123' } };
        const res = {
            // status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn()

        // @ts-ignore
        User.findOne = jest.fn().mockReturnValueOnce({
            "_id": "65c1b2fd2753b6c0c131b8cc",
            "firstName": "sonu",
            "lastName": "chauhan",
            "email": "sonu@yopmail.com",
            "password": "$2a$10$xCUooZ2o2m/.yN6wxpIlquyFdW2.KYw2TF4Fgmh4HqlcbSaeOhZIG",
            "role": [
                "admin"
            ],
            "loginCount": 17,
            "createdAt": "2024-02-06T04:18:05.231Z",
            "modifiedAt": "2024-02-12T07:55:53.752Z",
            "id": "65c1b2fd2753b6c0c131b8cc",
            // @ts-ignore
            comparePassword: jest.fn().mockResolvedValue(true)
        });

        User.prototype.save = jest.fn().mockImplementation(() => { })

        // @ts-ignore
        authController.login(req, res, next).then(() => {
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
        User.findOne = jest.fn().mockReturnValueOnce(null);

        User.prototype.save = jest.fn().mockImplementation(() => { })

        // @ts-ignore
        authController.login(req, res, next).then(() => {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid user" });
            done()
        }).catch((err: any) => {
            done(err)
        });
    });

    // it('should return 401 with error message for incorrect username or password', async () => {
    //   
    // });

    // it('should return 500 with error message for server error', async () => {

    // });
});