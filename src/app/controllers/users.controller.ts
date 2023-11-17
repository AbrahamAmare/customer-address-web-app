import { Response, Request, NextFunction } from "express";
import { User, userSchema } from "../models/user.model";
import tryCatch from "../utils/tryCatch.utils";
import ErrorResponse from "../utils/error-response";
import {
  UpdateUserSchema,
  UpdateUserType,
} from "../schemas/update-user.schema";

export const getUsers = tryCatch(async (req: Request, res: Response) => {
  const users = await User.find().select(
    "fullName firstName lastName email gender createdAt"
  );

  return res.status(200).json(users);
});

export const getUser = tryCatch(async (req: Request, res: Response) => {
  let userId = req.params.userId;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new ErrorResponse(404, "User does not exist");
  }
  return res.status(200).json(user);
});

export const createUser = tryCatch(async (req: Request, res: Response) => {
  await userSchema.parseAsync(req.body);
  const { password } = req.body;
  let { firstName, lastName, email, gender } = req.body;
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    gender,
  });

  await user.save();
  return res
    .status(200)
    .json({
      status: "Success",
      message:
        "a confirmation has been sent to your email address, please confirm your email ",
    });
});

export const updateUser = tryCatch(async (req: Request, res: Response) => {
  let userId = req.params.userId;
  await UpdateUserSchema.parseAsync(req.body);
  const update: UpdateUserType = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorResponse(404, "user does not exist");
  }

  user.firstName = update.firstName;
  user.lastName = update.lastName;
  user.gender = update.gender;
  await user.save();
  return res.status(200).json(user);
});

export const deleteUser = tryCatch(async (req: Request, res: Response) => {
  let userId = req.params.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorResponse(404, "User does not exist");
  }
  await user.deleteOne();
  return res.status(200).json(user);
});
