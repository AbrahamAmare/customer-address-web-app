import { Response, Request, NextFunction } from "express";
import {
  Customer,
  CustomerModel,
  CustomerSchema,
} from "../models/customer.model";
import { Address, AddressSchema, AddressType } from "../models/address.model";
import {
  Phone,
  PhoneDocument,
  PhonesCreateType,
  PhonesSchema,
} from "../models/phone.model";
import tryCatch from "../utils/tryCatch.utils";
import ErrorResponse from "../utils/error-response";
import {
  UpdateCustomerPhonesSchema,
  UpdateCustomerPhonesType,
} from "../schemas/update-customer-phones.schema";

import mongoose from "mongoose";
export const getCustomers = tryCatch(async (req: Request, res: Response) => {
  const customers = await Customer.find().select(
    "fullName firstName lastName email gender createdAt"
  );

  return res.status(200).json(customers);
});

export const getCustomer = tryCatch(async (req: Request, res: Response) => {
  let customerId = req.params.customerId;
  const customer = await Customer.findOne({ _id: customerId })
    .populate("address")
    .populate("phones");
  if (!customer) {
    throw new ErrorResponse(404, "Customer does not exist");
  }
  return res.status(200).json(customer);
});

export const createCustomer = tryCatch(async (req: Request, res: Response) => {
  console.log(req.body);
  await CustomerSchema.parseAsync(req.body);
  const { password } = req.body;
  let { firstName, lastName, email, gender, address, phones } = req.body;
  const customer = new Customer({
    firstName,
    lastName,
    email,
    password,
    gender,
  });

  const customerAddress = new Address({
    customerId: customer.id,
    ...address,
  });

  await customerAddress.save();

  const phoneNumbers = phones.map(
    (phone: PhoneDocument) => new Phone({ customerId: customer.id, ...phone })
  );
  await Promise.all(phoneNumbers.map((phone: PhoneDocument) => phone.save()));

  customer.address = customerAddress.id;
  customer.phones = phoneNumbers.map((phone: PhoneDocument) => phone._id);
  await customer.save();
  return res.status(200).json(customer);
});

export const updateCustomerAddress = tryCatch(
  async (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    const customer = await Customer.findById(customerId).populate("address");
    if (!customer) {
      throw new ErrorResponse(404, "Customer does not exist, It does not");
    }

    await AddressSchema.parseAsync(req.body);
    const address: AddressType = req.body;

    // if (!address.physicalAddress) {
    //   customer.address.physicalAddress = address.physicalAddress;
    // }

    customer.address.physicalAddress = address.physicalAddress;
    customer.address.city = address.city;
    customer.address.country = address.country;

    console.warn(customer.address);
    await customer.save();

    return res.status(200).json({ customer });
  }
);

export const updateCustomerPhone = tryCatch(
  async (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    await UpdateCustomerPhonesSchema.parseAsync(req.body);
    const phones: UpdateCustomerPhonesType = req.body;

    // const customer = await Customer.findById(customerId).populate("phones");
    // if (!customer) {
    //   throw new ErrorResponse(404, "Customer does not exist");
    // }
    const newPhones = phones.map((phone) => {
      return { _id: phone.phoneNumberId, phoneNumber: phone.phoneNumber };
    });

    for (const phone of newPhones) {
      const customer = await Customer.updateMany(
        {
          "phones._id": new mongoose.Types.ObjectId(phone._id),
        },
        {
          $set: { "phone.$.phoneNumber": phone.phoneNumber },
        },
        { new: true }
      ).populate("phones");

      console.log(customer);
    }

    // customer.phones.forEach((phone) => {
    //   for (let p = 0; p < phones.length; p++) {
    //     const element = phones[p];
    //     console.log(phone);
    //     if (element.phoneNumber === phone.phoneNumber) {
    //       phone.phoneNumber = element.phoneNumber;
    //     }
    //   }
    // });

    // customer.phones = customerPhones.map((phone) => {
    //   return { _id: phone.phoneNumberId, phoneNumber: phone.phoneNumber };
    // });

    // await customer.save();

    return res.status(200).json({ message: "Ok..." });
  }
);

export const AddCustomerPhone = tryCatch(
  async (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    const customer = await Customer.findById(customerId).populate("phones");

    if (!customer) {
      throw new ErrorResponse(404, "Customer does not exist");
    }

    await PhonesSchema.parseAsync(req.body);
    const phones: PhonesCreateType = req.body;

    let customerPhones: UpdateCustomerPhonesType = customer.phones;

    let total = customerPhones.length + phones.length;
    if (total > 3) {
      throw new ErrorResponse(
        400,
        "Maximum number of customer phones allowed is 3"
      );
    }

    phones.forEach((phone) => {
      let newPhone = {
        phoneNumber: phone.phoneNumber,
        customerId: customerId,
      };

      customer.phones.push(newPhone);
    });

    await customer.save();

    return res.status(200).json({ customer });
  }
);

export const updateCustomer = tryCatch(async (req: Request, res: Response) => {
  let customerId = req.params.customerId;
  const { firstName, lastName, email, gender } = req.body;
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ErrorResponse(404, "Customer does not exist");
  }

  customer.firstName = firstName;
  customer.lastName = lastName;
  customer.email = email;
  customer.gender = gender;
  customer.save();
  return res.status(200).json(customer);
});

export const deleteCustomer = tryCatch(async (req: Request, res: Response) => {
  let customerId = req.params.customerId;
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ErrorResponse(404, "Customer does not exist");
  }
  await customer.deleteOne();
  return res.status(200).json(customer);
});
