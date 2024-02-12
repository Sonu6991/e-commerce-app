"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("../utils/appError");
const productModel_1 = __importDefault(require("../models/productModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const handlerFactory_1 = __importDefault(require("./handlerFactory"));
// controllers/productController.js
const productController = {
    // Get all products
    getAllProducts: handlerFactory_1.default.getAll(productModel_1.default),
    // async (req: Request, res: Response, next: NextFunction) => {
    //   // factory.getAll(Product)
    //   // console.log("req headers", req.headers)
    //   const abc = await Product.find()
    //   res.status(201).json(abc);
    // },
    // Get a specific product by ID
    // getProductById: async (req: Request, res: Response, next: NextFunction) => {
    //   try {
    //     const product = await Product.findById(req.params.productId);
    //     if (!product) {
    //       return res.status(404).json({ message: "Product not found" });
    //     }
    //     return res.json({
    //       message: "success",
    //       product: product,
    //     });
    //   } catch (error: any) {
    //     return next(new AppError(error.message, 500));
    //   }
    // },
    getProductById: handlerFactory_1.default.getOne(productModel_1.default),
    // Add a new product
    addProduct: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const newProduct = yield productModel_1.default.insertMany(req.body, { session });
            yield session.commitTransaction();
            res.status(201).json(newProduct);
        }
        catch (error) {
            yield session.abortTransaction();
            res.status(400).json({ message: error.message });
        }
        finally {
            session.endSession();
        }
    }),
    // Update a product by ID
    updateProduct: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield productModel_1.default.findById(req.params.productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            // Update fields as needed
            product.price = req.body.price;
            product.description = req.body.description;
            product.category = req.body.category;
            product.availability = req.body.availability;
            product.stock = req.body.stock;
            const updatedProduct = yield product.save();
            res.json(updatedProduct);
        }
        catch (error) {
            return next(new appError_1.AppError(error.message, 500));
        }
    }),
    // Delete a product by ID
    deleteProduct: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield productModel_1.default.findByIdAndRemove(req.params.productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.json({ message: "Product deleted" });
        }
        catch (error) {
            return next(new appError_1.AppError(error.message, 500));
        }
    }),
};
exports.default = productController;
