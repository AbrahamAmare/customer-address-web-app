"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordSchema = void 0;
const zod_1 = require("zod");
exports.ChangePasswordSchema = zod_1.z
    .object({
    oldPassword: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Your password can not be less than 6 chars" }),
    newPassword: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Your password can not be less than 6 chars" }),
    confirmPassword: zod_1.z
        .string({ required_error: "Confirm Password is required" })
        .min(6, { message: "Your password can not be less than 6 chars" }),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Your passwords do not match",
    path: ["confirmPassword"],
});
//# sourceMappingURL=change-password.schema.js.map