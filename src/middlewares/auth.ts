import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { AppError } from "../utils/appError";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    // @ts-ignore
    const user = await User.findByToken(token);
    if (!user) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    // @ts-ignore
    req.user = user;
    next();
    return;
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const restrictTo = (...allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    console.log("req.user.role", req.user.role);
    if (
      allowedRoles.filter((arr1Item: string) =>
        req.user.role.includes(arr1Item)
      ).length <= 0
    ) {
      return next(
        new AppError("Access denied!", 403)
      );
    }

    next();
  };
};


export const appendUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    const user = req.user;
    req.params.id = user._id
    next();
    return;
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
