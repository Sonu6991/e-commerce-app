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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderModel_1 = __importDefault(require("../models/orderModel"));
const handlerFactory_1 = __importDefault(require("./handlerFactory"));
const appError_1 = require("../utils/appError");
const cartModel_1 = __importDefault(require("../models/cartModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const productModel_1 = __importDefault(require("../models/productModel"));
const const_1 = __importDefault(require("../utils/const"));
// controllers/productController.js
const orderController = {
    // Get all orders
    getAllOrders: handlerFactory_1.default.getAll(orderModel_1.default),
    // get my orders
    getMyOrders: handlerFactory_1.default.getAll(orderModel_1.default, 'userId'),
    // order checkout
    checkout: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        // @ts-ignore
        const user = req.user;
        try {
            const cart = yield cartModel_1.default.findOne({ userId: user._id, });
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            yield orderModel_1.default.create([{
                    userId: user._id,
                    products: cart.products,
                    billAmount: cart.bill,
                    status: const_1.default.orderStatus.CONFIRMED
                }], { session });
            try {
                for (var _d = true, _e = __asyncValues(cart.products), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                    _c = _f.value;
                    _d = false;
                    try {
                        const product = _c;
                        yield productModel_1.default.findByIdAndUpdate(product.productId, { $inc: { stock: -Number(product.quantity) } }, { session });
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            yield cartModel_1.default.findByIdAndDelete(cart._id, { session });
            yield session.commitTransaction();
            return res.status(201).json({ message: "Order confirmed!" });
        }
        catch (error) {
            yield session.abortTransaction();
            return next(new appError_1.AppError(error.message, 500));
        }
        finally {
            session.endSession();
        }
    })
};
exports.default = orderController;
