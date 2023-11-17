import { Schema, Document, Model, model } from "mongoose";
import { z } from "zod";

export const CustomerSchema = z
  .object({
    firstName: z.string({ required_error: "First Name is required" }),
    lastName: z.string({ required_error: "Last Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email("Please enter a valid email"),
    gender: z.enum(["male", "female", "other"]),
    address: z
      .object({
        physicalAddress: z.string().optional(),
        country: z.string({ required_error: "Country is required" }),
        city: z.string({ required_error: "City is required" }),
      })
      .optional(),
    phones: z
      .array(
        z.object({
          phoneNumber: z
            .string({ required_error: "Phone number is required" })
            .length(10, { message: "Phone number needs to be 10 digits" }),
        })
      )
      .nonempty()
      .max(3, { message: "Maximum number of phones allowed is 3" }),
  })
  .refine(
    async (data) => {
      var response = await Customer.findOne({ email: data.email });
      if (!response) return true;
    },
    { message: "A User already registered with the given", path: ["email"] }
  );

export type Customer = z.infer<typeof CustomerSchema>;

export type CustomerDocument = Customer &
  Document & {
    fullName: string;
  };

export type CustomerModel = Model<CustomerDocument> & {};

const customerSchema = new Schema<CustomerDocument>(
  {
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

    address: { type: Schema.Types.ObjectId, required: false, ref: "Address" },
    phones: [
      {
        type: Schema.Types.ObjectId,
        required: [true, "You need to enter one  phone number"],
        ref: "Phone",
      },
    ],
  },
  { timestamps: true }
);

customerSchema.pre("save", async function (next: (err?: Error) => void) {
  console.log(this);
  this.fullName = `${this.firstName}, ${this.lastName}`;
  next();
});

export const Customer = model<CustomerDocument, CustomerModel>(
  "Customer",
  customerSchema
);
