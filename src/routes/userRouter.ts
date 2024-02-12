import express from "express";
import userController from "../controllers/userController";
import authController from "../controllers/authController";
import { protect, restrictTo } from "../middlewares/auth";
import constants from "../utils/const";
const router: any = express.Router();
router.use(protect)
// user routes
router.get("/", restrictTo(constants.userRoles.ADMIN), userController.getAll); //for admin only
router.get("/profile", protect, restrictTo(constants.userRoles.ADMIN, constants.userRoles.CUSTOMER), userController.getProfile);
router.get("/:id", restrictTo(constants.userRoles.ADMIN), userController.getUserById); //for admin only

router.patch("/updateProfile", restrictTo(constants.userRoles.ADMIN, constants.userRoles.CUSTOMER), userController.updateProfile); //for both admin and customer
router.put("/:id", restrictTo(constants.userRoles.ADMIN), userController.updateUser); //for admin only

export default router;
