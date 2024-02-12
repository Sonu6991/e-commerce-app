"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const authController_1 = __importDefault(require("../controllers/authController"));
const userModel_1 = __importDefault(require("../models/userModel"));
(0, globals_1.describe)('login', () => {
    (0, globals_1.it)('should return success message for valid user and password', (done) => {
        const req = { body: { email: 'sonu@yopmail.com', password: 'Sonu@123' } };
        const res = {
            // status: jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        const next = globals_1.jest.fn();
        // @ts-ignore
        userModel_1.default.findOne = globals_1.jest.fn().mockReturnValueOnce({
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
            comparePassword: globals_1.jest.fn().mockResolvedValue(true)
        });
        userModel_1.default.prototype.save = globals_1.jest.fn().mockImplementation(() => { });
        // @ts-ignore
        authController_1.default.login(req, res, next).then(() => {
            (0, globals_1.expect)(res.json).toHaveBeenCalledWith({ message: 'Login Success', status: 1 });
            done();
        }).catch((err) => {
            done(err);
        });
    });
    (0, globals_1.it)('should return 400 with error message for invalid user', (done) => {
        const req = { body: { email: 'fsf@yopmail.com', password: 'Sonu@123' } };
        const res = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        const next = globals_1.jest.fn();
        // @ts-ignore
        userModel_1.default.findOne = globals_1.jest.fn().mockReturnValueOnce(null);
        userModel_1.default.prototype.save = globals_1.jest.fn().mockImplementation(() => { });
        // @ts-ignore
        authController_1.default.login(req, res, next).then(() => {
            (0, globals_1.expect)(res.status).toHaveBeenCalledWith(400);
            (0, globals_1.expect)(res.json).toHaveBeenCalledWith({ message: "Invalid user" });
            done();
        }).catch((err) => {
            done(err);
        });
    });
    // it('should return 401 with error message for incorrect username or password', async () => {
    //   
    // });
    // it('should return 500 with error message for server error', async () => {
    // });
});
