import { Schema, Model, Document, model, Types } from "mongoose";
import { z } from "zod";

export const PhonesSchema = z
  .array(
    z.object({
      phoneNumber: z
        .string({ required_error: "Phone number is required" })
        .length(10, { message: "Phone number needs to be 10 digits" }),
    })
  )
  .nonempty()
  .max(3, { message: "Maximum number of phones allowed is 3" });

export type PhonesCreateType = z.infer<typeof PhonesSchema>;

export type PhoneType = {
  phoneNumber: string;
  customerId: Types.ObjectId;
};

export type PhoneDocument = PhoneType & Document & {};
export type PhoneModel = Model<PhoneDocument> & {};

export const phoneSchema = new Schema<PhoneDocument>({
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    length: [10, "Phone number length is invalid"],
  },

  customerId: {
    type: Schema.Types.ObjectId,
    required: [true, "Customer is required"],
    ref: "Customer",
  },
});

export const Phone = model<PhoneDocument, PhoneModel>("Phone", phoneSchema);
