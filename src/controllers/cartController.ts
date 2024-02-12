import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import factory from "./handlerFactory";
import Cart from "../models/cartModel";
import Product from "../models/productModel";

// controllers/productController.js

const cartController = {
    // Get all products
    getAllCarts: factory.getAll(Cart),
    // Get a specific product by ID
    getMyCart: async (req: Request, res: Response, next: NextFunction) => {
        // @ts-ignore
        const user = req.user
        try {
            const cart = await Cart.findOne({ userId: user?._id, });
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            return res.json({
                message: "success",
                cart: cart,
            });
        } catch (error: any) {
            return next(new AppError(error.message, 500));
        }
    },
    // Add a new product to cart
    addToCart: async (req: Request, res: Response, next: NextFunction) => {
        const { productId, quantity, name, price } = req.body;
        // @ts-ignore
        const user = req.user
        try {
            const productDetails = await Product.findById(productId)
            if (!productDetails) {
                return next(new AppError("Product not found or not available", 404))
            }

            if (quantity > productDetails.stock) {
                return next(new AppError("not enough stock", 400))
            }

            let cart = await Cart.findOne({ userId: user._id });
            //no cart for user, create new cart
            if (!cart) {
                const newCart = await Cart.create({
                    userId: user._id,
                    products: [{ productId, quantity, name, price }],
                    bill: quantity * price
                });

                return res.status(201).send(newCart);
            }
            //cart exists for user
            let itemIndex = cart.products.findIndex(p => p?.productId?.toString() === productId
            );

            if (itemIndex > -1) {
                //product exists in the cart, update the quantity
                let productItem = cart.products[itemIndex];
                // const newQuantity = productItem.quantity + quantity;
                // if (newQuantity > productDetails.stock) {
                //     return next(new AppError("not enough stock", 400))
                // }
                // productItem.quantity = newQuantity
                productItem.quantity = quantity
                cart.products[itemIndex] = productItem;
                cart.bill = cart?.products?.reduce((acc: any, curr: any) => {
                    return acc + curr.quantity * curr.price;
                }, 0)

            } else {
                //product does not exists in cart, add new item
                cart.products.push({ productId, quantity, name, price });
                cart.bill = cart?.products?.reduce((acc: any, curr: any) => {
                    return acc + curr.quantity * curr.price;
                }, 0)

            }
            cart = await cart.save();
            return res.status(201).send(cart);

        } catch (err: any) {
            console.log(err);
            return next(new AppError(err.message, 400))
        }


    },

    // Remove a product from cart
    removeFromCart: async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.body;
        // @ts-ignore
        const user = req.user

        if (!productId) {
            return next(new AppError("product id required!", 404))
        }
        try {
            const cart = await Cart.findOne({ userId: user._id, });
            if (!cart) return next(new AppError("cart not found", 404))
            let itemIndex = cart.products.findIndex(p => p?.productId?.toString() === productId
            );
            if (itemIndex > -1) {
                cart.products.splice(itemIndex)
                cart.bill = cart?.products?.reduce((acc: any, curr: any) => {
                    return acc + curr.quantity * curr.price;
                }, 0)
            } else {
                return next(new AppError("Selected Product does not exists in cart", 404))
            }
            cart.save()
            return res.status(200).send(cart);

        } catch (err: any) {
            console.log(err);
            return next(new AppError(err.message, 400))
        }
    }
};

export default cartController