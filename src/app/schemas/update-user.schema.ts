import { z } from "zod";

export const UpdateUserSchema = z.object({
  firstName: z.string({ required_error: "First Name is required" }),
  lastName: z.string({ required_error: "Last Name is required" }),
  gender: z.enum(["male", "female", "other"]),
});

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
