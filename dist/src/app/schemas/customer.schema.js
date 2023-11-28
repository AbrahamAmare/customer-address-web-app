"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerCreateSchema = void 0;
const zod_1 = require("zod");
const customer_model_1 = require("../models/customer.model");
exports.CustomerCreateSchema = zod_1.z
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
    address: zod_1.z
        .object({
        physicalAddress: zod_1.z.string().optional(),
        country: zod_1.z.string({ required_error: "Country is required" }),
        city: zod_1.z.string({ required_error: "City is required" }),
    })
        .optional(),
    phones: zod_1.z
        .array(zod_1.z.object({
        phoneNumber: zod_1.z
            .string({ required_error: "Phone number is required" })
            .length(10, { message: "Phone number needs to be 10 digits" }),
    }))
        .nonempty()
        .max(3, { message: "Maximum number of phones allowed is 3" }),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})
    .refine(async (data) => {
    var response = await customer_model_1.Customer.findOne({ email: data.email });
    if (!response)
        return true;
}, { message: "A User already registered with the given", path: ["email"] });
//# sourceMappingURL=customer.schema.js.map