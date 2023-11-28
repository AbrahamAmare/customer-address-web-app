"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
exports.userSchema = zod_1.z
    .object({
    firstName: zod_1.z.string({ required_error: "First Name is required" }),
    lastName: zod_1.z.string({ required_error: "Last Name is required" }),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email("Please enter a valid email"),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Your password can not be less than 6 chars" }),
    confirmPassword: zod_1.z
        .string({ required_error: "Confirm Password is required" })
        .min(6, { message: "Your password can not be less than 6 chars" }),
    gender: zod_1.z.enum(["male", "female", "other"]),
    isEmailConfirmed: zod_1.z.boolean().default(false),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})
    .refine(async (data) => {
    let response = await exports.User.findOne({ email: data.email });
    if (!response)
        return true;
}, { message: "A User already registered with the given", path: ["email"] });
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "First name is a required field."],
    },
    lastName: {
        type: String,
        required: [true, "Last name is a required field."],
    },
    fullName: {
        type: String,
    },
    gender: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is a required field."],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password length can not be less than 6 chars"],
    },
    auth: {
        sessionToken: {
            type: String,
            required: false,
        },
        expiresAt: {
            type: Date,
            required: false,
        },
    },
    reset: {
        passwordResetToken: {
            type: String,
            required: false,
        },
        passwordResetTokenExpires: {
            type: String,
            required: false,
        },
    },
    isEmailConfirmed: {
        type: Boolean,
        default: false,
    },
    emailConfirmationToken: {
        type: String,
        required: false,
    },
}, { timestamps: true });
UserSchema.pre("save", async function (next) {
    console.log(this);
    this.fullName = `${this.firstName}, ${this.lastName}`;
    next();
});
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt_1.default.hash(this.password, 12);
    next();
});
UserSchema.methods.comparePassword = async function (password, candidatePassword) {
    return await bcrypt_1.default.compare(candidatePassword, password);
};
UserSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const token = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
    const reset = {
        passwordResetToken: token,
        passwordResetTokenExpires: Date.now() + 10 * 60 * 1000,
    };
    this.reset = reset;
    return resetToken;
};
UserSchema.methods.createEmailConfirmationToken = function () {
    const confirmationToken = crypto_1.default.randomBytes(32).toString("hex");
    const token = crypto_1.default
        .createHash("sha256")
        .update(confirmationToken)
        .digest("hex");
    this.emailConfirmationToken = token;
    console.log(token);
    console.warn(this.emailConfirmationToken);
    return confirmationToken;
};
exports.User = (0, mongoose_1.model)("User", UserSchema);
//# sourceMappingURL=user.model.js.map