import factory from "./handlerFactory";
import User from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import Token from "../models/tokenModel";
const crypto = require("crypto");
import * as bcrypt from "bcryptjs";
import { AppError } from "../utils/appError";
import { UserValidatorClass } from "../validators/userValidator";
import { validate } from "class-validator";
import { ChangePasswordValidatorClass } from "../validators/changePasswordValidator";

const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, role, address } = req.body
    try {
      let inputData = new UserValidatorClass()
      inputData.firstName = firstName
      inputData.lastName = lastName
      inputData.email = email
      inputData.password = password
      inputData.role = role
      inputData.address = address

      const errors = await validate(inputData, { groups: ['add'] })

      if (errors?.length) {
        return next(new AppError(`Bad request`, 400))
      }
      const user = await User.create(req.body)
      return res.status(201).json({ message: "user registerd.", user: user });

    } catch (error: any) {
      return next(new AppError(error.message, 400))

    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        // Username not found
        return res.status(400).json({ message: "Invalid user" });
      }
      const isMatch = await user.comparePassword(req.body.password);
      if (!isMatch) {
        // Incorrect password
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const token = user.generateAuthToken();

      // Increments the login count for the user
      await user.incrementLoginCount();

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
      });

      return res.json({ message: "Login Success", status: 1 });
    } catch (error: any) {
      return next(
        new AppError(error.message, 400)
      );
    }

  },
  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      return next(new AppError('email required!', 400))
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User does not exist" });
      }
      const token = await Token.findOne({ userId: user._id });
      if (token) await token.deleteOne();
      let resetToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(
        resetToken,
        Number(process.env.BCRYPT_SALT)
      );
      await Token.create({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      });
      return res.json({
        message: "reset password token valid for 10 min",
        resetToken: resetToken,
      });
    } catch (error: any) {
      return next(
        new AppError(`Error generating token: ${error.message}`, 400)
      );
    }
  },
  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    const { userId, token, password } = req.body;

    try {
      const pswdResetToken = await Token.findOne({ userId });
      if (!pswdResetToken) {
        return next(
          new AppError("Expired password reset token", 400)
        );
      }

      const isValid = await bcrypt.compare(token, pswdResetToken.token);
      if (!isValid) {
        return next(
          new AppError("Invalid or expired password reset token", 400)
        );
      }
      const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
      const updatedUser = await User.findByIdAndUpdate(userId, { password: hash }, { new: true });
      await pswdResetToken.deleteOne();
      return res.json({
        message: "Password Reset Successfully",
        user: updatedUser,
      });
    } catch (error: any) {
      console.log("error", error);
      return next(new AppError("Error resetting password", 400));
    }
  },
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    const user = req.user
    const { password, passwordConfirm } = req.body
    try {
      let passwordInput = new ChangePasswordValidatorClass()
      passwordInput.password = password
      passwordInput.passwordConfirm = passwordConfirm
      const errors = await validate(passwordInput)

      if (errors?.length) {
        // console.log("error", errors)
        return next(new AppError(`Bad request`, 400))
      }
      const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));

      await User.findByIdAndUpdate(user._id, { password: hash }, { new: true })
      res.clearCookie("token");
      return res.json({
        message: "Password changed Successfully, Please login again!",
      });
    } catch (error) {
      console.log("error", error);
      return next(new AppError("Error changing password", 400));
    }
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("token");
    return res.json({ message: "Logout Successfuly", status: 1 });
  }
};

export default authController;
