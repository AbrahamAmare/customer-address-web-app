"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = exports.CustomerSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
exports.CustomerSchema = zod_1.z
    .object({
    firstName: zod_1.z.string({ required_error: "First Name is required" }),
    lastName: zod_1.z.string({ required_error: "Last Name is required" }),
    email: zod_1.z
        .string({ required_error: "Email is required" })
        .email("Please enter a valid email"),
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
    .refine(async (data) => {
    var response = await exports.Customer.findOne({ email: data.email });
    if (!response)
        return true;
}, { message: "A User already registered with the given", path: ["email"] });
const customerSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "First name is a required field."],
    },
    lastName: {
        type: String,
        required: [true, "Last name is a required field."],
    },
    fullName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is a required field."],
        unique: true,
        lowercase: true,
    },
    gender: { type: String, required: [true, "Gender is required"] },
    address: { type: mongoose_1.Schema.Types.ObjectId, required: false, ref: "Address" },
    phones: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            required: [true, "You need to enter one  phone number"],
            ref: "Phone",
        },
    ],
}, { timestamps: true });
customerSchema.pre("save", async function (next) {
    console.log(this);
    this.fullName = `${this.firstName}, ${this.lastName}`;
    next();
});
exports.Customer = (0, mongoose_1.model)("Customer", customerSchema);
//# sourceMappingURL=customer.model.js.map