"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// auth routes
router.post("/signup", authController_1.default.signup);
router.post("/login", authController_1.default.login);
router.post("/forgotPassword", authController_1.default.forgotPassword);
router.post("/resetPassword", authController_1.default.resetPassword);
router.post("/changePassword", auth_1.protect, authController_1.default.changePassword);
router.post("/logout", auth_1.protect, authController_1.default.logout);
exports.default = router;
