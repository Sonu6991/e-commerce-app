"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cartController_1 = __importDefault(require("../controllers/cartController"));
const auth_1 = require("../middlewares/auth");
const const_1 = __importDefault(require("../utils/const"));
const express = require("express");
const router = express.Router();
router.use(auth_1.protect);
// Get all carts
router.get("/", (0, auth_1.restrictTo)(const_1.default.userRoles.ADMIN), cartController_1.default.getAllCarts);
// Add Product to cart
router.post("/", (0, auth_1.restrictTo)(const_1.default.userRoles.CUSTOMER), cartController_1.default.addToCart);
// Get Cart
router.get("/myCart", (0, auth_1.restrictTo)(const_1.default.userRoles.CUSTOMER), cartController_1.default.getMyCart);
// Delete a product from cart
router.patch("/removeItem", (0, auth_1.restrictTo)(const_1.default.userRoles.CUSTOMER), cartController_1.default.removeFromCart);
exports.default = router;
