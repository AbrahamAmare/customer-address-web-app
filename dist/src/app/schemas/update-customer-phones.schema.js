"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneSchema = exports.UpdateCustomerPhonesSchema = void 0;
const zod_1 = require("zod");
exports.UpdateCustomerPhonesSchema = zod_1.z.array(zod_1.z.object({
    phoneNumber: zod_1.z
        .string({ required_error: "Phone Number is required" })
        .length(10, "Phone number length should be 10"),
    phoneNumberId: zod_1.z.string({
        required_error: "Phone number id is required",
    }),
}));
exports.PhoneSchema = zod_1.z.object({
    _id: zod_1.z.string(),
});
// export const CustomerPhoneSchema =
//   UpdateCustomerPhonesSchema.merge(PhoneSchema);
// export type CustomerPhoneType = z.infer<typeof CustomerPhoneSchema>;
//# sourceMappingURL=update-customer-phones.schema.js.map