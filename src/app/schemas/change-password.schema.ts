import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    oldPassword: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Your password can not be less than 6 chars" }),
    newPassword: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Your password can not be less than 6 chars" }),
    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .min(6, { message: "Your password can not be less than 6 chars" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Your passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;
