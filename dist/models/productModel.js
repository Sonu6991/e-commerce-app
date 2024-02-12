"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongooseLeanId = require("mongoose-lean-id");
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
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "product name required!"],
    },
    price: {
        type: Number,
        required: [true, "product price required!"],
    },
    category: {
        type: String,
        required: [true, "product category required!"],
    },
    stock: {
        type: Number,
        required: [true, "stock required!"],
    },
    description: {
        type: String,
    },
}, options);
productSchema.plugin(mongooseLeanId);
const Product = mongoose_1.default.model("product", productSchema);
exports.default = Product;
