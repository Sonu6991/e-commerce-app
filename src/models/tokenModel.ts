const mongoose = require("mongoose");
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
const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // expires: process.env.password_rest_token_exp,
        index: { expires: '1m' }
    },
}, options
);
const Token = mongoose.model("token", tokenSchema);

export default Token