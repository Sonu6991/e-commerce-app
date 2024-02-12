import cartController from "../controllers/cartController";
import { protect, restrictTo } from "../middlewares/auth";
import constants from "../utils/const";

const express = require("express");
const router = express.Router();
router.use(protect);

// Get all carts
router.get("/", restrictTo(constants.userRoles.ADMIN), cartController.getAllCarts);

// Add Product to cart
router.post("/", restrictTo(constants.userRoles.CUSTOMER), cartController.addToCart);

// Get Cart
router.get("/myCart", restrictTo(constants.userRoles.CUSTOMER), cartController.getMyCart);

// Delete a product from cart
router.patch("/removeItem", restrictTo(constants.userRoles.CUSTOMER), cartController.removeFromCart);

export default router
