"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeEmailSchema = void 0;
const zod_1 = require("zod");
const user_model_1 = require("../models/user.model");
exports.ChangeEmailSchema = zod_1.z
    .object({
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Please provide a valid email" }),
})
    .refine(async (data) => {
    let response = await user_model_1.User.findOne({ email: data.email });
    if (!response)
        return true;
}, { message: "A User already registered with the given", path: ["email"] });
//# sourceMappingURL=change-email.schema.js.map