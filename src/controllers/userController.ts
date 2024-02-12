import factory from "./handlerFactory";
import User from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { UserValidatorClass } from "../validators/userValidator";
import { validate } from "class-validator";

const userController = {
  getAll: factory.getAll(User),
  getUserById: factory.getOne(User),
  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    return res.json({ message: "success", user: req.user });
  },
  updateUser: factory.updateOne(User),
  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, address } = req.body
    // @ts-ignore
    const user = req.user
    try {
      let input = new UserValidatorClass()
      input.firstName = firstName
      input.lastName = lastName
      input.email = email
      input.address = address

      const errors = await validate(input, {
        groups: ['edit']
      })

      if (errors?.length) {
        console.log("error", errors)
        return next(new AppError(`Bad request`, 400))
      }
      const updatedUser = await User.findByIdAndUpdate(user._id, req.body, { new: true })
      return res.json({
        message: "Profile updated Successfully ",
        user: updatedUser,
      });

    } catch (error: any) {
      return next(
        new AppError(error.message, 400)
      );
    }
  },
};



export default userController;
