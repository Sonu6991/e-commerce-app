import mongoose from "mongoose";

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

const productSchema = new mongoose.Schema<any>(
  {
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
  },
  options
);
productSchema.plugin(mongooseLeanId);
const Product = mongoose.model("product", productSchema);
export default Product;
