import tryCatch from "../utils/tryCatch.utils";
import { User } from "../models/user.model";
import ErrorResponse from "../utils/error-response";
import { Request, Response, NextFunction } from "express";

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies["ec-book-cookie"];
    if (!sessionToken) {
      throw new ErrorResponse(401, "Please login to continue ...");
    }

    const user = await User.findOne({ "auth.sessionToken": sessionToken });
    if (!user) {
      throw new ErrorResponse(401, "Please login to continue ...");
    }

    if (user.auth.expiresAt < new Date()) {
      throw new ErrorResponse(
        401,
        "Your session has expired, Please login to continue ..."
      );
    }

    return next();
  } catch (error) {
    return res.status(401).json(error);
  }
};

export default requireAuth;
