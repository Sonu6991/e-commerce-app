"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handlerFactory_1 = __importDefault(require("./handlerFactory"));
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = require("../utils/appError");
const userValidator_1 = require("../validators/userValidator");
const class_validator_1 = require("class-validator");
const userController = {
    getAll: handlerFactory_1.default.getAll(userModel_1.default),
    getUserById: handlerFactory_1.default.getOne(userModel_1.default),
    getProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        return res.json({ message: "success", user: req.user });
    }),
    updateUser: handlerFactory_1.default.updateOne(userModel_1.default),
    updateProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstName, lastName, email, address } = req.body;
        // @ts-ignore
        const user = req.user;
        try {
            let input = new userValidator_1.UserValidatorClass();
            input.firstName = firstName;
            input.lastName = lastName;
            input.email = email;
            input.address = address;
            const errors = yield (0, class_validator_1.validate)(input, {
                groups: ['edit']
            });
            if (errors === null || errors === void 0 ? void 0 : errors.length) {
                console.log("error", errors);
                return next(new appError_1.AppError(`Bad request`, 400));
            }
            const updatedUser = yield userModel_1.default.findByIdAndUpdate(user._id, req.body, { new: true });
            return res.json({
                message: "Profile updated Successfully ",
                user: updatedUser,
            });
        }
        catch (error) {
            return next(new appError_1.AppError(error.message, 400));
        }
    }),
};
exports.default = userController;
