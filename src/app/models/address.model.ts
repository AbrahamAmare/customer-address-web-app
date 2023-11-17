import mongoose from "mongoose";
import { Schema, Model, Document, model, Types } from "mongoose";

import { z } from "zod";

export const AddressSchema = z
  .object({
    physicalAddress: z.string().optional().nullish(),
    country: z.string({ required_error: "Country is required" }),
    city: z.string({ required_error: "City is required" }),
  })
  .required();

export type AddressType = z.infer<typeof AddressSchema>;

export type AddressDocument = AddressType &
  Document & {
    customerId: {
      type: Schema.Types.ObjectId;
      required: false;
      ref: "Address";
    };
  };
export type AddressModel = Model<AddressDocument> & {};

const addressSchema = new Schema<AddressDocument>({
  physicalAddress: { type: String },
  country: { type: String, required: true },
  city: { type: String, required: true },
  customerId: {
    type: Schema.Types.ObjectId,
    required: [true, "Customer is required"],
    ref: "Customer",
  },
});

export const Address = model<AddressDocument, AddressModel>(
  "Address",
  addressSchema
);
