import { z } from "zod";
import { Customer } from "../models/customer.model";

export const CustomerCreateSchema = z
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
    address: z
      .object({
        physicalAddress: z.string().optional(),
        country: z.string({ required_error: "Country is required" }),
        city: z.string({ required_error: "City is required" }),
      })
      .optional(),
    phones: z
      .array(
        z.object({
          phoneNumber: z
            .string({ required_error: "Phone number is required" })
            .length(10, { message: "Phone number needs to be 10 digits" }),
        })
      )
      .nonempty()
      .max(3, { message: "Maximum number of phones allowed is 3" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    async (data) => {
      var response = await Customer.findOne({ email: data.email });
      if (!response) return true;
    },
    { message: "A User already registered with the given", path: ["email"] }
  );

//

// const PhoneCreateSchema = z.object({
//   phoneNumber: z
//     .string({ required_error: "Phone number is required" })
//     .length(10, { message: "Phone number needs to be 10 digits" }),
// });

type CustomerCreateSchema = z.infer<typeof CustomerCreateSchema>;
