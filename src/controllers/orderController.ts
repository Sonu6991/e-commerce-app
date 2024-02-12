import { NextFunction, Request, Response } from "express";
import Order from "../models/orderModel";
import factory from "./handlerFactory";
import { AppError } from "../utils/appError";
import Cart from "../models/cartModel";
import mongoose from "mongoose";
import Product from "../models/productModel";
import constants from "../utils/const";

// controllers/productController.js

const orderController = {
    // Get all orders
    getAllOrders: factory.getAll(Order),
    // get my orders
    getMyOrders: factory.getAll(Order, 'userId'),
    // order checkout
    checkout: async (req: Request, res: Response, next: NextFunction) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        // @ts-ignore
        const user = req.user
        try {
            const cart = await Cart.findOne({ userId: user._id, })

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            await Order.create([{
                userId: user._id,
                products: cart.products,
                billAmount: cart.bill,
                status: constants.orderStatus.CONFIRMED
            }], { session })

            for await (const product of cart.products) {
                await Product.findByIdAndUpdate(product.productId, { $inc: { stock: -Number(product.quantity) } }, { session })
            }
            await Cart.findByIdAndDelete(cart._id, { session })
            await session.commitTransaction()
            return res.status(201).json({ message: "Order confirmed!" });

        } catch (error: any) {
            await session.abortTransaction()
            return next(new AppError(error.message, 500));
        } finally {
            session.endSession()
        }
    }
}

export default orderController