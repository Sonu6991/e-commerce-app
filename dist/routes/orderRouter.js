"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderController_1 = __importDefault(require("../controllers/orderController"));
const auth_1 = require("../middlewares/auth");
const const_1 = __importDefault(require("../utils/const"));
const express = require("express");
const router = express.Router();
router.use(auth_1.protect);
// Get all orders
router.get("/", (0, auth_1.restrictTo)(const_1.default.userRoles.ADMIN), orderController_1.default.getAllOrders);
// Get orders of a user
router.get("/myOrders", (0, auth_1.restrictTo)(const_1.default.userRoles.CUSTOMER), auth_1.appendUserId, orderController_1.default.getMyOrders);
// order checkout
router.post("/checkout", (0, auth_1.restrictTo)(const_1.default.userRoles.CUSTOMER), orderController_1.default.checkout);
exports.default = router;
