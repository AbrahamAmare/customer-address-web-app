"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = void 0;
const zod_1 = require("zod");
exports.UpdateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string({ required_error: "First Name is required" }),
    lastName: zod_1.z.string({ required_error: "Last Name is required" }),
    gender: zod_1.z.enum(["male", "female", "other"]),
});
//# sourceMappingURL=update-user.schema.js.map