"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = exports.AddressSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.AddressSchema = zod_1.z
    .object({
    physicalAddress: zod_1.z.string().optional().nullish(),
    country: zod_1.z.string({ required_error: "Country is required" }),
    city: zod_1.z.string({ required_error: "City is required" }),
})
    .required();
const addressSchema = new mongoose_1.Schema({
    physicalAddress: { type: String },
    country: { type: String, required: true },
    city: { type: String, required: true },
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Customer is required"],
        ref: "Customer",
    },
});
exports.Address = (0, mongoose_1.model)("Address", addressSchema);
//# sourceMappingURL=address.model.js.map