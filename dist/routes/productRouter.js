"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productController_1 = __importDefault(require("../controllers/productController"));
const auth_1 = require("../middlewares/auth");
const const_1 = __importDefault(require("../utils/const"));
const express = require("express");
const router = express.Router();
// router.use(protect);
// Get all products
router.get("/", productController_1.default.getAllProducts);
// Get a specific product by ID
router.get("/:id", (0, auth_1.restrictTo)(const_1.default.userRoles.ADMIN, const_1.default.userRoles.CUSTOMER), productController_1.default.getProductById);
// Add a new product
router.post("/", (0, auth_1.restrictTo)(const_1.default.userRoles.ADMIN), productController_1.default.addProduct);
// Update a product by ID
router.put("/:productId", (0, auth_1.restrictTo)(const_1.default.userRoles.ADMIN), productController_1.default.updateProduct);
// Delete a product by ID
router.delete("/:productId", (0, auth_1.restrictTo)(const_1.default.userRoles.ADMIN), productController_1.default.deleteProduct);
exports.default = router;
