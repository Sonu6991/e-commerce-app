"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const options = {
    versionKey: false,
    timestamps: {
        createdAt: true,
        updatedAt: "modifiedAt",
        select: false,
    },
    toJSON: {
        virtuals: true,
    },
    toObject: { virtuals: true },
};
const CartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "product",
            },
            quantity: Number,
            name: String,
            price: Number
        }
    ],
    bill: {
        type: Number,
    },
}, options);
const Cart = mongoose_1.default.model("cart", CartSchema);
exports.default = Cart;
