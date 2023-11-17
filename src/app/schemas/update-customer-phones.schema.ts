import { z } from "zod";

export const UpdateCustomerPhonesSchema = z.array(
  z.object({
    phoneNumber: z
      .string({ required_error: "Phone Number is required" })
      .length(10, "Phone number length should be 10"),
    phoneNumberId: z.string({
      required_error: "Phone number id is required",
    }),
  })
);

export type UpdateCustomerPhonesType = z.infer<
  typeof UpdateCustomerPhonesSchema
>;

export const PhoneSchema = z.object({
  _id: z.string(),
});

// export const CustomerPhoneSchema =
//   UpdateCustomerPhonesSchema.merge(PhoneSchema);
// export type CustomerPhoneType = z.infer<typeof CustomerPhoneSchema>;
