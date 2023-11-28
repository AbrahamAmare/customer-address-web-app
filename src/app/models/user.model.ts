import { Schema, Document, Model, model } from "mongoose";
import { z } from "zod";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const userSchema = z
  .object({
    firstName: z.string({ required_error: "First Name is required" }),
    lastName: z.string({ required_error: "Last Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Your password can not be less than 6 chars" }),
    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .min(6, { message: "Your password can not be less than 6 chars" }),
    gender: z.enum(["male", "female", "other"]),
    isEmailConfirmed: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    async (data) => {
      let response = await User.findOne({ email: data.email });
      if (!response) return true;
    },
    { message: "A User already registered with the given", path: ["email"] }
  );

type UserType = z.infer<typeof userSchema>;

type UserDocument = UserType &
  Document & {
    fullName: string;
    auth: {
      sessionToken: String;
      expiresAt: Date;
    };
    emailConfirmationToken: String;
    reset: {
      passwordResetToken: String;
      passwordResetTokenExpires: Date;
    };
    comparePassword: (
      password: string,
      candidatePassword: string
    ) => Promise<boolean>;

    createResetPasswordToken: () => string;
    createEmailConfirmationToken: () => string;
  };

type UserModel = Model<UserDocument> & {};
const UserSchema = new Schema<UserDocument>(
  {
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
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next: (err?: Error) => void) {
  console.log(this);
  this.fullName = `${this.firstName}, ${this.lastName}`;
  next();
});

UserSchema.pre("save", async function (next: (err?: Error) => void) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (
  password: string,
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, password);
};

UserSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const token = crypto.createHash("sha256").update(resetToken).digest("hex");

  const reset = {
    passwordResetToken: token,
    passwordResetTokenExpires: Date.now() + 10 * 60 * 1000,
  };
  this.reset = reset;
  return resetToken;
};

UserSchema.methods.createEmailConfirmationToken = function () {
  const confirmationToken = crypto.randomBytes(32).toString("hex");
  const token = crypto
    .createHash("sha256")
    .update(confirmationToken)
    .digest("hex");

  this.emailConfirmationToken = token;
  console.log(token);
  console.warn(this.emailConfirmationToken);
  return confirmationToken;
};

export const User = model<UserDocument, UserModel>("User", UserSchema);
