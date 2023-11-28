"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.AddCustomerPhone = exports.updateCustomerPhone = exports.updateCustomerAddress = exports.createCustomer = exports.getCustomer = exports.getCustomers = void 0;
const customer_model_1 = require("../models/customer.model");
const address_model_1 = require("../models/address.model");
const phone_model_1 = require("../models/phone.model");
const tryCatch_utils_1 = __importDefault(require("../utils/tryCatch.utils"));
const error_response_1 = __importDefault(require("../utils/error-response"));
const update_customer_phones_schema_1 = require("../schemas/update-customer-phones.schema");
const mongoose_1 = __importDefault(require("mongoose"));
exports.getCustomers = (0, tryCatch_utils_1.default)(async (req, res) => {
    const customers = await customer_model_1.Customer.find().select("fullName firstName lastName email gender createdAt");
    return res.status(200).json(customers);
});
exports.getCustomer = (0, tryCatch_utils_1.default)(async (req, res) => {
    let customerId = req.params.customerId;
    const customer = await customer_model_1.Customer.findOne({ _id: customerId })
        .populate("address")
        .populate("phones");
    if (!customer) {
        throw new error_response_1.default(404, "Customer does not exist");
    }
    return res.status(200).json(customer);
});
exports.createCustomer = (0, tryCatch_utils_1.default)(async (req, res) => {
    console.log(req.body);
    await customer_model_1.CustomerSchema.parseAsync(req.body);
    const { password } = req.body;
    let { firstName, lastName, email, gender, address, phones } = req.body;
    const customer = new customer_model_1.Customer({
        firstName,
        lastName,
        email,
        password,
        gender,
    });
    const customerAddress = new address_model_1.Address({
        customerId: customer.id,
        ...address,
    });
    await customerAddress.save();
    const phoneNumbers = phones.map((phone) => new phone_model_1.Phone({ customerId: customer.id, ...phone }));
    await Promise.all(phoneNumbers.map((phone) => phone.save()));
    customer.address = customerAddress.id;
    customer.phones = phoneNumbers.map((phone) => phone._id);
    await customer.save();
    return res.status(200).json(customer);
});
exports.updateCustomerAddress = (0, tryCatch_utils_1.default)(async (req, res) => {
    const customerId = req.params.customerId;
    const customer = await customer_model_1.Customer.findById(customerId).populate("address");
    if (!customer) {
        throw new error_response_1.default(404, "Customer does not exist, It does not");
    }
    await address_model_1.AddressSchema.parseAsync(req.body);
    const address = req.body;
    // if (!address.physicalAddress) {
    //   customer.address.physicalAddress = address.physicalAddress;
    // }
    customer.address.physicalAddress = address.physicalAddress;
    customer.address.city = address.city;
    customer.address.country = address.country;
    console.warn(customer.address);
    await customer.save();
    return res.status(200).json({ customer });
});
exports.updateCustomerPhone = (0, tryCatch_utils_1.default)(async (req, res) => {
    const customerId = req.params.customerId;
    await update_customer_phones_schema_1.UpdateCustomerPhonesSchema.parseAsync(req.body);
    const phones = req.body;
    // const customer = await Customer.findById(customerId).populate("phones");
    // if (!customer) {
    //   throw new ErrorResponse(404, "Customer does not exist");
    // }
    const newPhones = phones.map((phone) => {
        return { _id: phone.phoneNumberId, phoneNumber: phone.phoneNumber };
    });
    for (const phone of newPhones) {
        const customer = await customer_model_1.Customer.updateMany({
            "phones._id": new mongoose_1.default.Types.ObjectId(phone._id),
        }, {
            $set: { "phone.$.phoneNumber": phone.phoneNumber },
        }, { new: true }).populate("phones");
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
});
exports.AddCustomerPhone = (0, tryCatch_utils_1.default)(async (req, res) => {
    const customerId = req.params.customerId;
    const customer = await customer_model_1.Customer.findById(customerId).populate("phones");
    if (!customer) {
        throw new error_response_1.default(404, "Customer does not exist");
    }
    await phone_model_1.PhonesSchema.parseAsync(req.body);
    const phones = req.body;
    let customerPhones = customer.phones;
    let total = customerPhones.length + phones.length;
    if (total > 3) {
        throw new error_response_1.default(400, "Maximum number of customer phones allowed is 3");
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
});
exports.updateCustomer = (0, tryCatch_utils_1.default)(async (req, res) => {
    let customerId = req.params.customerId;
    const { firstName, lastName, email, gender } = req.body;
    const customer = await customer_model_1.Customer.findById(customerId);
    if (!customer) {
        throw new error_response_1.default(404, "Customer does not exist");
    }
    customer.firstName = firstName;
    customer.lastName = lastName;
    customer.email = email;
    customer.gender = gender;
    customer.save();
    return res.status(200).json(customer);
});
exports.deleteCustomer = (0, tryCatch_utils_1.default)(async (req, res) => {
    let customerId = req.params.customerId;
    const customer = await customer_model_1.Customer.findById(customerId);
    if (!customer) {
        throw new error_response_1.default(404, "Customer does not exist");
    }
    await customer.deleteOne();
    return res.status(200).json(customer);
});
//# sourceMappingURL=customers.controller.js.map