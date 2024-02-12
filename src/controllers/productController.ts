import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import Product from "../models/productModel";
import mongoose from "mongoose";
import factory from "./handlerFactory";

// controllers/productController.js

const productController = {
  // Get all products
  getAllProducts: factory.getAll(Product),
  
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
  getProductById: factory.getOne(Product),
  // Add a new product
  addProduct: async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
      const newProduct = await Product.insertMany(req.body, { session });
      await session.commitTransaction()
      res.status(201).json(newProduct);
    } catch (error: any) {
      await session.abortTransaction()
      res.status(400).json({ message: error.message });
    } finally {
      session.endSession()
    }
  },
  // Update a product by ID
  updateProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await Product.findById(req.params.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Update fields as needed
      product.price = req.body.price;
      product.description = req.body.description;
      product.category = req.body.category;
      product.availability = req.body.availability;
      product.stock = req.body.stock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } catch (error: any) {
      return next(new AppError(error.message, 500));
    }
  },
  // Delete a product by ID
  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await Product.findByIdAndRemove(req.params.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted" });
    } catch (error: any) {
      return next(new AppError(error.message, 500));
    }
  },
};

export default productController