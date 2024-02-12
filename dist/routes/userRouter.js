"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const auth_1 = require("../middlewares/auth");
const const_1 = __importDefault(require("../utils/const"));
const router = express_1.default.Router();
router.use(auth_1.protect);
// user routes
router.get("/", (0, auth_1.restrictTo)(const_1.default.userRoles.ADMIN), userController_1.default.getAll); //for admin only
router.get("/profile", auth_1.protect, (0, auth_1.restrictTo)(const_1.default.userRoles.ADMIN, const_1.default.userRoles.CUSTOMER), userController_1.default.getProfile);
router.get("/:id", (0, auth_1.restrictTo)(const_1.default.userRoles.ADMIN), userController_1.default.getUserById); //for admin only
router.patch("/updateProfile", (0, auth_1.restrictTo)(const_1.default.userRoles.ADMIN, const_1.default.userRoles.CUSTOMER), userController_1.default.updateProfile); //for both admin and customer
router.put("/:id", (0, auth_1.restrictTo)(const_1.default.userRoles.ADMIN), userController_1.default.updateUser); //for admin only
exports.default = router;
