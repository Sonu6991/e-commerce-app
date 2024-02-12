import mongoose from "mongoose";
import validator from "validator";
const jwt = require("jsonwebtoken");
import * as bcrypt from "bcryptjs";

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

const userSchema = new mongoose.Schema<any>(
  {
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
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      required: true,
      type: String,
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [128, "Password must be less than 128 characters long"],
      validate: {
        validator: function (value: string) {
          // Require at least one uppercase letter, one lowercase letter, one special character and one number
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/])[a-zA-Z\d!@#$%^&*()_\-+={}[\]\\|:;'<>,.?/]{8,}$/;
          return regex.test(value);
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number",
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

  },
  options
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const hash = await bcrypt.hash(
      this.password,
      Number(process.env.BCRYPT_SALT)
    );
    this.password = hash;
    next();
  } catch (err: any) {
    return next(err);
  }
});

// Compare password with hashed password in database
userSchema.methods.comparePassword = function (password: string) {
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

userSchema.statics.findByToken = function (token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return this.findOne({ _id: decoded._id });
  } catch (err: any) {
    throw new Error(`Error verifying token: ${err.message}`);
  }
};

userSchema.plugin(mongooseLeanId);
const User = mongoose.model("user", userSchema);
export default User;
