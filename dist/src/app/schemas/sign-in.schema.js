"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInSchema = void 0;
const zod_1 = require("zod");
exports.SignInSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email({ message: "Please enter a valid email" }),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, { message: "Password can not be less than 6 chars long" }),
});
//# sourceMappingURL=sign-in.schema.js.map