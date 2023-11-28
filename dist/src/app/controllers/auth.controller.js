"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmEmail = exports.resetPassword = exports.forgotPassword = exports.changeEmail = exports.changePassword = exports.signOut = exports.signIn = exports.signUp = void 0;
const user_model_1 = require("../models/user.model");
const tryCatch_utils_1 = __importDefault(require("../utils/tryCatch.utils"));
const error_response_1 = __importDefault(require("../utils/error-response"));
const sign_in_schema_1 = require("../schemas/sign-in.schema");
const uuid_1 = require("uuid");
const change_password_schema_1 = require("../schemas/change-password.schema");
const change_email_schema_1 = require("../schemas/change-email.schema");
const crypto_1 = __importDefault(require("crypto"));
const reset_password_schema_1 = require("../schemas/reset-password.schema");
const mail_service_1 = __importDefault(require("../services/mail.service"));
exports.signUp = (0, tryCatch_utils_1.default)(async (req, res) => {
    await user_model_1.userSchema.parseAsync(req.body);
    const { password } = req.body;
    let { firstName, lastName, email, gender } = req.body;
    const user = new user_model_1.User({
        firstName,
        lastName,
        email,
        password,
        gender,
    });
    const confirmationToken = user.createEmailConfirmationToken();
    await user.save();
    const emailConfirmationUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/confirm-email/${confirmationToken}`;
    let html = `<html>
  <h3>Please use the link below to confirm your email </h3>
  <a href="${emailConfirmationUrl}">Confirm</a>
  </html>`;
    const emailOptions = {
        email: [user.email],
        subject: "Email Confirmation",
        message: html,
    };
    await (0, mail_service_1.default)(emailOptions);
    return res.status(200).json({
        status: "Success",
        message: "a confirmation has been sent to your email address, please confirm your email ",
    });
});
exports.signIn = (0, tryCatch_utils_1.default)(async (req, res) => {
    await sign_in_schema_1.SignInSchema.parseAsync(req.body);
    const signIn = req.body;
    const user = await user_model_1.User.findOne({ email: signIn.email });
    if (!user || !(await user.comparePassword(user.password, signIn.password))) {
        throw new error_response_1.default(403, "Email or Password is incorrect, Please try again!");
    }
    if (user.isEmailConfirmed === false) {
        throw new error_response_1.default(403, "You have not confirmed your email, please confirm your email to gain access to your account");
    }
    const sessionToken = (0, uuid_1.v4)();
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
exports.signOut = (0, tryCatch_utils_1.default)(async (req, res) => {
    // req.session.destroy();
});
exports.changePassword = (0, tryCatch_utils_1.default)(async (req, res) => {
    let userId = req.params.userId;
    await change_password_schema_1.ChangePasswordSchema.parseAsync(req.body);
    const request = req.body;
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new error_response_1.default(404, "user does not exist");
    }
    if (!(await user.comparePassword(user.password, request.oldPassword))) {
        throw new error_response_1.default(403, "Old password you entered is incorrect");
    }
    user.password = request.oldPassword;
    await user.save();
    return res.status(303).redirect("http://localhost:6001/api/v1/auth/sign-in");
});
exports.changeEmail = (0, tryCatch_utils_1.default)(async (req, res) => {
    let userId = req.params.userId;
    await change_email_schema_1.ChangeEmailSchema.parseAsync(req.body);
    const request = req.body;
    const user = await user_model_1.User.findOne({ email: request.email });
    if (!user) {
        throw new error_response_1.default(404, "user does not exist");
    }
    const confirmationToken = user.createEmailConfirmationToken();
    user.isEmailConfirmed = false;
    await user.save();
    const emailConfirmationUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/confirm-email/${confirmationToken}`;
    let html = `<html>
  <h3>Please use the link below to confirm your email </h3>
  <a href="${emailConfirmationUrl}">Confirm</a>
  </html>`;
    const emailOptions = {
        email: [user.email],
        subject: "Email Confirmation",
        message: html,
    };
    await (0, mail_service_1.default)(emailOptions);
    return res.status(200).json({
        status: "Success",
        message: "a confirmation has been sent to your email address, please confirm your email ",
    });
});
exports.forgotPassword = (0, tryCatch_utils_1.default)(async (req, res) => {
    console.warn("Printing", req.body.payload);
    const { email } = req.body.payload;
    const user = await user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new error_response_1.default(404, "User with the given email does not exist");
    }
    const resetToken = user.createResetPasswordToken();
    await user.save();
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const html = `<h1>Hi, This link below is to reset your password<h1>
    <a href=${resetUrl}>Reset Password </a>`;
    var options = {
        email: [user.email],
        subject: "Password Reset",
        message: html,
    };
    await (0, mail_service_1.default)(options);
    return res.status(200).json({
        status: "Success",
        message: "A link to reset your password has been sent to your email",
    });
});
exports.resetPassword = (0, tryCatch_utils_1.default)(async (req, res) => {
    await reset_password_schema_1.ResetPasswordSchema.parseAsync(req.body);
    const token = crypto_1.default
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");
    const user = await user_model_1.User.findOne({
        "reset.passwordResetToken": token,
        "reset.passwordResetTokenExpires": { $gt: Date.now() },
    });
    if (!user) {
        throw new error_response_1.default(404, "Token is either invalid or expired");
    }
    user.password = req.body.password;
    user.reset.passwordResetToken = undefined;
    user.reset.passwordResetTokenExpires = undefined;
    const sessionToken = (0, uuid_1.v4)();
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
exports.confirmEmail = (0, tryCatch_utils_1.default)(async (req, res) => {
    const confirmationToken = req.params.confirmationToken;
    if (!confirmationToken) {
        throw new error_response_1.default(404, "Email confirmation token is invalid");
    }
    const token = crypto_1.default
        .createHash("sha256")
        .update(req.params.confirmationToken)
        .digest("hex");
    const user = await user_model_1.User.findOne({ emailConfirmationToken: token });
    if (!user) {
        throw new error_response_1.default(404, "Email confirmation token is invalid");
    }
    user.isEmailConfirmed = true;
    const sessionToken = (0, uuid_1.v4)();
    const expires = new Date().setDate(new Date().getDate() + 1);
    const auth = {
        sessionToken: sessionToken,
        expiresAt: new Date(expires),
    };
    user.auth = auth;
    await user.save();
    res.status(200).json(user);
});
//# sourceMappingURL=auth.controller.js.map