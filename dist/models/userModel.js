"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const jwt = require("jsonwebtoken");
const bcrypt = __importStar(require("bcryptjs"));
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
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, "first name required!"],
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "last name required!"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email address"],
    },
    password: {
        required: true,
        type: String,
        minlength: [8, "Password must be at least 8 characters long"],
        maxlength: [128, "Password must be less than 128 characters long"],
        validate: {
            validator: function (value) {
                // Require at least one uppercase letter, one lowercase letter, one special character and one number
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/;
                return regex.test(value);
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
        },
    },
    role: {
        type: [{ type: String }],
        required: true,
    },
    loginCount: {
        type: Number,
        default: 0,
    },
    address: {
        type: String
    },
}, options);
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            return next();
        }
        try {
            const hash = yield bcrypt.hash(this.password, Number(process.env.BCRYPT_SALT));
            this.password = hash;
            next();
        }
        catch (err) {
            return next(err);
        }
    });
});
// Compare password with hashed password in database
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};
// Increment login count when user logs in
userSchema.methods.incrementLoginCount = function () {
    this.loginCount += 1;
    return this.save();
};
// Generate a JWT token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_Expires_In,
    });
    return token;
};
userSchema.statics.findByToken = function (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return this.findOne({ _id: decoded._id });
    }
    catch (err) {
        throw new Error(`Error verifying token: ${err.message}`);
    }
};
userSchema.plugin(mongooseLeanId);
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
