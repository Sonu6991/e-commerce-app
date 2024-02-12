"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const userModel_1 = __importDefault(require("../models/userModel"));
const tokenModel_1 = __importDefault(require("../models/tokenModel"));
const crypto = require("crypto");
const bcrypt = __importStar(require("bcryptjs"));
const appError_1 = require("../utils/appError");
const userValidator_1 = require("../validators/userValidator");
const class_validator_1 = require("class-validator");
const changePasswordValidator_1 = require("../validators/changePasswordValidator");
const authController = {
    signup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstName, lastName, email, password, role, address } = req.body;
        try {
            let inputData = new userValidator_1.UserValidatorClass();
            inputData.firstName = firstName;
            inputData.lastName = lastName;
            inputData.email = email;
            inputData.password = password;
            inputData.role = role;
            inputData.address = address;
            const errors = yield (0, class_validator_1.validate)(inputData, { groups: ['add'] });
            if (errors === null || errors === void 0 ? void 0 : errors.length) {
                console.log("error", errors);
                return next(new appError_1.AppError(`Bad request`, 400));
            }
            const user = yield userModel_1.default.create(req.body);
            return res.status(201).json({ message: "user registerd.", user: user });
        }
        catch (error) {
            return next(new appError_1.AppError(error.message, 400));
        }
    }),
    login: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("User", userModel_1.default);
            const user = yield userModel_1.default.findOne({ email: req.body.email });
            if (!user) {
                // Username not found
                return res.status(400).json({ message: "Invalid user" });
            }
            const isMatch = yield user.comparePassword(req.body.password);
            if (!isMatch) {
                // Incorrect password
                return res.status(401).json({ message: "Invalid username or password" });
            }
            // const token = user.generateAuthToken();
            // // Increments the login count for the user
            // await user.incrementLoginCount();
            // res.cookie("token", token, {
            //   httpOnly: true,
            //   sameSite: "strict",
            //   secure: false,
            // });
            return res.json({ message: "Login Success", status: 1 });
        }
        catch (error) {
            console.log("error", error);
            return next(new appError_1.AppError(error.message, 400));
        }
    }),
    forgotPassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.body;
        if (!email) {
            throw new Error(`email required!`);
        }
        try {
            const user = yield userModel_1.default.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User does not exist" });
            }
            const token = yield tokenModel_1.default.findOne({ userId: user._id });
            if (token)
                yield token.deleteOne();
            let resetToken = crypto.randomBytes(32).toString("hex");
            const hash = yield bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));
            yield tokenModel_1.default.create({
                userId: user._id,
                token: hash,
                createdAt: Date.now(),
            });
            return res.json({
                message: "reset password token valid for 10 min",
                resetToken: resetToken,
            });
        }
        catch (error) {
            return next(new appError_1.AppError(`Error generating token: ${error.message}`, 400));
        }
    }),
    resetPassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, token, password } = req.body;
        try {
            const pswdResetToken = yield tokenModel_1.default.findOne({ userId });
            if (!pswdResetToken) {
                return next(new appError_1.AppError("Invalid or expired password reset token", 400));
            }
            const isValid = yield bcrypt.compare(token, pswdResetToken.token);
            if (!isValid) {
                return next(new appError_1.AppError("Invalid or expired password reset token", 400));
            }
            const hash = yield bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
            const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, { password: hash }, { new: true });
            yield pswdResetToken.deleteOne();
            return res.json({
                message: "Password Reset Successfully ",
                user: updatedUser,
            });
        }
        catch (error) {
            console.log("error", error);
            return next(new appError_1.AppError("Error resetting password", 400));
        }
    }),
    changePassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        const user = req.user;
        const { password, passwordConfirm } = req.body;
        try {
            let passwordInput = new changePasswordValidator_1.ChangePasswordValidatorClass();
            passwordInput.password = password;
            passwordInput.passwordConfirm = passwordConfirm;
            const errors = yield (0, class_validator_1.validate)(passwordInput);
            if (errors === null || errors === void 0 ? void 0 : errors.length) {
                console.log("error", errors);
                return next(new appError_1.AppError(`Bad request`, 400));
            }
            const hash = yield bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
            yield userModel_1.default.findByIdAndUpdate(user._id, { password: hash }, { new: true });
            res.clearCookie("token");
            return res.json({
                message: "Password changed Successfully, Please login again!",
            });
        }
        catch (error) {
            console.log("error", error);
            return next(new appError_1.AppError("Error changing password", 400));
        }
    }),
    logout: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        res.clearCookie("token");
        return res.json({ message: "Logout Successfuly", status: 1 });
    })
};
exports.default = authController;
