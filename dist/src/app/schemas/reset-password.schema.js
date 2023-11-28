"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordSchema = void 0;
const zod_1 = require("zod");
exports.ResetPasswordSchema = zod_1.z
    .object({
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Your password can not be less than 6 chars" }),
    confirmPassword: zod_1.z
        .string({ required_error: "Confirm Password is required" })
        .min(6, { message: "Your password can not be less than 6 chars" }),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Your passwords do not match",
    path: ["confirmPassword"],
});
//# sourceMappingURL=reset-password.schema.js.map