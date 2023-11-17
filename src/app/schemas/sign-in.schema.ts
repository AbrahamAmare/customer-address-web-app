import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password can not be less than 6 chars long" }),
});

export type SignInType = z.infer<typeof SignInSchema>;
