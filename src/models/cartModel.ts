import mongoose from "mongoose";

const Schema = mongoose.Schema
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


const CartSchema = new Schema(
    {
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

    },
    options
);

const Cart = mongoose.model("cart", CartSchema);

export default Cart