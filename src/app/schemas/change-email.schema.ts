import { z } from "zod";
import { User } from "../models/user.model";
export const ChangeEmailSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please provide a valid email" }),
  })
  .refine(
    async (data) => {
      let response = await User.findOne({ email: data.email });
      if (!response) return true;
    },
    { message: "A User already registered with the given", path: ["email"] }
  );

export type ChangeEmailType = z.infer<typeof ChangeEmailSchema>;
