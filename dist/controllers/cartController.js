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
const handlerFactory_1 = __importDefault(require("./handlerFactory"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
// controllers/productController.js
const cartController = {
    // Get all products
    getAllCarts: handlerFactory_1.default.getAll(cartModel_1.default),
    // Get a specific product by ID
    getMyCart: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        const user = req.user;
        try {
            const cart = yield cartModel_1.default.findOne({ userId: user === null || user === void 0 ? void 0 : user._id, });
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            return res.json({
                message: "success",
                cart: cart,
            });
        }
        catch (error) {
            return next(new appError_1.AppError(error.message, 500));
        }
    }),
    // Add a new product to cart
    addToCart: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { productId, quantity, name, price } = req.body;
        // @ts-ignore
        const user = req.user;
        try {
            const productDetails = yield productModel_1.default.findById(productId);
            if (!productDetails) {
                return next(new appError_1.AppError("Product not found or not available", 404));
            }
            if (quantity > productDetails.stock) {
                return next(new appError_1.AppError("not enough stock", 400));
            }
            let cart = yield cartModel_1.default.findOne({ userId: user._id });
            //no cart for user, create new cart
            if (!cart) {
                const newCart = yield cartModel_1.default.create({
                    userId: user._id,
                    products: [{ productId, quantity, name, price }],
                    bill: quantity * price
                });
                return res.status(201).send(newCart);
            }
            //cart exists for user
            let itemIndex = cart.products.findIndex(p => { var _a; return ((_a = p === null || p === void 0 ? void 0 : p.productId) === null || _a === void 0 ? void 0 : _a.toString()) === productId; });
            if (itemIndex > -1) {
                //product exists in the cart, update the quantity
                let productItem = cart.products[itemIndex];
                // const newQuantity = productItem.quantity + quantity;
                // if (newQuantity > productDetails.stock) {
                //     return next(new AppError("not enough stock", 400))
                // }
                // productItem.quantity = newQuantity
                productItem.quantity = quantity;
                cart.products[itemIndex] = productItem;
                cart.bill = (_a = cart === null || cart === void 0 ? void 0 : cart.products) === null || _a === void 0 ? void 0 : _a.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price;
                }, 0);
            }
            else {
                //product does not exists in cart, add new item
                cart.products.push({ productId, quantity, name, price });
                cart.bill = (_b = cart === null || cart === void 0 ? void 0 : cart.products) === null || _b === void 0 ? void 0 : _b.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price;
                }, 0);
            }
            cart = yield cart.save();
            return res.status(201).send(cart);
        }
        catch (err) {
            console.log(err);
            return next(new appError_1.AppError(err.message, 400));
        }
    }),
    // Remove a product from cart
    removeFromCart: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const { productId } = req.body;
        // @ts-ignore
        const user = req.user;
        if (!productId) {
            return next(new appError_1.AppError("product id required!", 404));
        }
        try {
            const cart = yield cartModel_1.default.findOne({ userId: user._id, });
            if (!cart)
                return next(new appError_1.AppError("cart not found", 404));
            let itemIndex = cart.products.findIndex(p => { var _a; return ((_a = p === null || p === void 0 ? void 0 : p.productId) === null || _a === void 0 ? void 0 : _a.toString()) === productId; });
            if (itemIndex > -1) {
                cart.products.splice(itemIndex);
                cart.bill = (_c = cart === null || cart === void 0 ? void 0 : cart.products) === null || _c === void 0 ? void 0 : _c.reduce((acc, curr) => {
                    return acc + curr.quantity * curr.price;
                }, 0);
            }
            else {
                return next(new appError_1.AppError("Selected Product does not exists in cart", 404));
            }
            cart.save();
            return res.status(200).send(cart);
        }
        catch (err) {
            console.log(err);
            return next(new appError_1.AppError(err.message, 400));
        }
    })
};
exports.default = cartController;
