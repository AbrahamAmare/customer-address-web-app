"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phone = exports.phoneSchema = exports.PhonesSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.PhonesSchema = zod_1.z
    .array(zod_1.z.object({
    phoneNumber: zod_1.z
        .string({ required_error: "Phone number is required" })
        .length(10, { message: "Phone number needs to be 10 digits" }),
}))
    .nonempty()
    .max(3, { message: "Maximum number of phones allowed is 3" });
exports.phoneSchema = new mongoose_1.Schema({
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        length: [10, "Phone number length is invalid"],
    },
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Customer is required"],
        ref: "Customer",
    },
});
exports.Phone = (0, mongoose_1.model)("Phone", exports.phoneSchema);
//# sourceMappingURL=phone.model.js.map