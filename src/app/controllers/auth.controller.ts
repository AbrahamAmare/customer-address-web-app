import { Response, Request, NextFunction } from "express";
import { User, userSchema } from "../models/user.model";
import tryCatch from "../utils/tryCatch.utils";
import ErrorResponse from "../utils/error-response";
import { SignInSchema, SignInType } from "../schemas/sign-in.schema";
import { v4 } from "uuid";
import {
  ChangePasswordSchema,
  ChangePasswordType,
} from "../schemas/change-password.schema";

import {
  ChangeEmailSchema,
  ChangeEmailType,
} from "../schemas/change-email.schema";

import crypto from "crypto";
import {
  ResetPasswordSchema,
  ResetPasswordType,
} from "../schemas/reset-password.schema";
import sendEmail from "../services/mail.service";
import { EmailOption } from "../types/email-option";

export const signUp = tryCatch(async (req: Request, res: Response) => {
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

  const confirmationToken = user.createEmailConfirmationToken();
  await user.save();
  const emailConfirmationUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/confirm-email/${confirmationToken}`;
  let html = `<html>
  <h3>Please use the link below to confirm your email </h3>
  <a href="${emailConfirmationUrl}">Confirm</a>
  </html>`;

  const emailOptions: EmailOption = {
    email: [user.email],
    subject: "Email Confirmation",
    message: html,
  };

  await sendEmail(emailOptions);

  return res.status(200).json({
    status: "Success",
    message:
      "a confirmation has been sent to your email address, please confirm your email ",
  });
});

export const signIn = tryCatch(async (req: Request, res: Response) => {
  await SignInSchema.parseAsync(req.body);
  const signIn: SignInType = req.body;
  const user = await User.findOne({ email: signIn.email });
  if (!user || !(await user.comparePassword(user.password, signIn.password))) {
    throw new ErrorResponse(
      403,
      "Email or Password is incorrect, Please try again!"
    );
  }

  if (user.isEmailConfirmed === false) {
    throw new ErrorResponse(
      403,
      "You have not confirmed your email, please confirm your email to gain access to your account"
    );
  }

  const sessionToken = v4();
  const expires = new Date().setDate(new Date().getDate() + 1);

  const auth = {
    sessionToken: sessionToken,
    expiresAt: new Date(expires),
  };
  user.auth = auth;
  user.save();

  res.cookie("ec-book-cookie", sessionToken, { maxAge: expires });
  return res.status(200).json(user);
});

export const signOut = tryCatch(async (req: Request, res: Response) => {
  // req.session.destroy();
});
export const changePassword = tryCatch(async (req: Request, res: Response) => {
  let userId = req.params.userId;
  await ChangePasswordSchema.parseAsync(req.body);

  const request: ChangePasswordType = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorResponse(404, "user does not exist");
  }

  if (!(await user.comparePassword(user.password, request.oldPassword))) {
    throw new ErrorResponse(403, "Old password you entered is incorrect");
  }

  user.password = request.oldPassword;
  await user.save();
  return res.status(303).redirect("http://localhost:6001/api/v1/auth/sign-in");
});

export const changeEmail = tryCatch(async (req: Request, res: Response) => {
  let userId = req.params.userId;
  await ChangeEmailSchema.parseAsync(req.body);

  const request: ChangeEmailType = req.body;
  const user = await User.findOne({ email: request.email });
  if (!user) {
    throw new ErrorResponse(404, "user does not exist");
  }
  const confirmationToken = user.createEmailConfirmationToken();
  user.isEmailConfirmed = false;
  await user.save();
  const emailConfirmationUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/confirm-email/${confirmationToken}`;
  let html = `<html>
  <h3>Please use the link below to confirm your email </h3>
  <a href="${emailConfirmationUrl}">Confirm</a>
  </html>`;

  const emailOptions: EmailOption = {
    email: [user.email],
    subject: "Email Confirmation",
    message: html,
  };

  await sendEmail(emailOptions);

  return res.status(200).json({
    status: "Success",
    message:
      "a confirmation has been sent to your email address, please confirm your email ",
  });
});

export const forgotPassword = tryCatch(async (req: Request, res: Response) => {
  console.warn("Printing", req.body.payload);
  const { email } = req.body.payload;
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ErrorResponse(404, "User with the given email does not exist");
  }

  const resetToken = user.createResetPasswordToken();
  await user.save();

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  const html = `<h1>Hi, This link below is to reset your password<h1>
    <a href=${resetUrl}>Reset Password </a>`;

  var options: EmailOption = {
    email: [user.email],
    subject: "Password Reset",
    message: html,
  };
  await sendEmail(options);
  return res.status(200).json({
    status: "Success",
    message: "A link to reset your password has been sent to your email",
  });
});

export const resetPassword = tryCatch(async (req: Request, res: Response) => {
  await ResetPasswordSchema.parseAsync(req.body);
  const token = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    "reset.passwordResetToken": token,
    "reset.passwordResetTokenExpires": { $gt: Date.now() },
  });
  if (!user) {
    throw new ErrorResponse(404, "Token is either invalid or expired");
  }

  user.password = req.body.password;
  user.reset.passwordResetToken = undefined;
  user.reset.passwordResetTokenExpires = undefined;

  const sessionToken = v4();
  const expires = new Date().setDate(new Date().getDate() + 1);

  const auth = {
    sessionToken: sessionToken,
    expiresAt: new Date(expires),
  };
  user.auth = auth;
  await user.save();

  res.status(200).json({
    status: "Success",
    message: "Your password was successfully reset",
  });
});

export const confirmEmail = tryCatch(async (req: Request, res: Response) => {
  const confirmationToken = req.params.confirmationToken;
  if (!confirmationToken) {
    throw new ErrorResponse(404, "Email confirmation token is invalid");
  }
  const token = crypto
    .createHash("sha256")
    .update(req.params.confirmationToken)
    .digest("hex");

  const user = await User.findOne({ emailConfirmationToken: token });
  if (!user) {
    throw new ErrorResponse(404, "Email confirmation token is invalid");
  }

  user.isEmailConfirmed = true;
  const sessionToken = v4();
  const expires = new Date().setDate(new Date().getDate() + 1);

  const auth = {
    sessionToken: sessionToken,
    expiresAt: new Date(expires),
  };
  user.auth = auth;
  await user.save();

  res.status(200).json(user);
});
