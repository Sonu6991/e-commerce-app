import orderController from "../controllers/orderController";
import { appendUserId, protect, restrictTo } from "../middlewares/auth";
import constants from "../utils/const";

const express = require("express");
const router = express.Router();
router.use(protect);


// Get all orders
router.get("/", restrictTo(constants.userRoles.ADMIN), orderController.getAllOrders);
// Get orders of a user
router.get("/myOrders", restrictTo(constants.userRoles.CUSTOMER), appendUserId, orderController.getMyOrders);

// order checkout
router.post("/checkout", restrictTo(constants.userRoles.CUSTOMER), orderController.checkout);

export default router