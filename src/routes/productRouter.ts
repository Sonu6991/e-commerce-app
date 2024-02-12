import productController from "../controllers/productController";
import { protect, restrictTo } from "../middlewares/auth";
import constants from "../utils/const";

const express = require("express");
const router = express.Router();
// router.use(protect);

// Get all products
router.get("/", productController.getAllProducts);

// Get a specific product by ID
router.get("/:id", restrictTo(constants.userRoles.ADMIN, constants.userRoles.CUSTOMER), productController.getProductById);

// Add a new product
router.post("/", restrictTo(constants.userRoles.ADMIN), productController.addProduct);

// Update a product by ID
router.put("/:productId", restrictTo(constants.userRoles.ADMIN), productController.updateProduct);

// Delete a product by ID
router.delete("/:productId", restrictTo(constants.userRoles.ADMIN), productController.deleteProduct);

export default router
