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
exports.appendUserId = exports.restrictTo = exports.protect = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = require("../utils/appError");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        // @ts-ignore
        const user = yield userModel_1.default.findByToken(token);
        if (!user) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        // @ts-ignore
        req.user = user;
        next();
        return;
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.protect = protect;
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("req.user.role", req.user.role);
        if (allowedRoles.filter((arr1Item) => req.user.role.includes(arr1Item)).length <= 0) {
            return next(new appError_1.AppError("Access denied!", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
const appendUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const user = req.user;
        req.params.id = user._id;
        next();
        return;
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
exports.appendUserId = appendUserId;
