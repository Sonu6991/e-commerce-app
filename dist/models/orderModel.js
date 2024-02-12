"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const const_1 = __importDefault(require("../utils/const"));
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
const orderSchema = new Schema({
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
    billAmount: {
        type: Number,
    },
    status: {
        type: String,
        default: const_1.default.orderStatus.PENDING
    }
}, options);
const Order = mongoose_1.default.model("order", orderSchema);
exports.default = Order;
