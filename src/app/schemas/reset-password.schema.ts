import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Your password can not be less than 6 chars" }),
    confirmPassword: z
      .string({ required_error: "Confirm Password is required" })
      .min(6, { message: "Your password can not be less than 6 chars" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Your passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
