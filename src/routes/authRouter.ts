import express from "express";
import userController from "../controllers/userController";
import authController from "../controllers/authController";
import { protect } from "../middlewares/auth";
const router: any = express.Router();

// auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);
router.post("/changePassword", protect, authController.changePassword);
router.post("/logout", protect, authController.logout);

export default router;
