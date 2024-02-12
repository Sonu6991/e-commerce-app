import mongoose from "mongoose";
import constants from "../utils/const";

const Schema = mongoose.Schema;

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
        default: constants.orderStatus.PENDING
    }
}, options
);
const Order = mongoose.model("order", orderSchema);

export default Order