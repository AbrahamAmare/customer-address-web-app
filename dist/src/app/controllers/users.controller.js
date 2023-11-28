"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const user_model_1 = require("../models/user.model");
const tryCatch_utils_1 = __importDefault(require("../utils/tryCatch.utils"));
const error_response_1 = __importDefault(require("../utils/error-response"));
const update_user_schema_1 = require("../schemas/update-user.schema");
exports.getUsers = (0, tryCatch_utils_1.default)(async (req, res) => {
    const { page, limit } = req.query;
    const take = parseInt(limit);
    const pageParsed = parseInt(page);
    // const startIndex = (parseInt(page as string) - 1) * take;
    // const endIndex = parseInt(page as string) * take;
    const count = await user_model_1.User.find().count();
    const users = await user_model_1.User.find()
        .select("fullName firstName lastName email gender createdAt")
        .limit(take * 1)
        .skip((pageParsed - 1) * take);
    return res.status(200).json({
        users,
        paging: {
            totalPages: Math.ceil(count / take),
            page: pageParsed,
        },
    });
});
exports.getUser = (0, tryCatch_utils_1.default)(async (req, res) => {
    let userId = req.params.userId;
    const user = await user_model_1.User.findOne({ _id: userId });
    if (!user) {
        throw new error_response_1.default(404, "User does not exist");
    }
    return res.status(200).json(user);
});
exports.createUser = (0, tryCatch_utils_1.default)(async (req, res) => {
    await user_model_1.userSchema.parseAsync(req.body);
    const { password } = req.body;
    let { firstName, lastName, email, gender } = req.body;
    const user = new user_model_1.User({
        firstName,
        lastName,
        email,
        password,
        gender,
    });
    await user.save();
    return res.status(200).json({
        status: "Success",
        message: "a confirmation has been sent to your email address, please confirm your email ",
    });
});
exports.updateUser = (0, tryCatch_utils_1.default)(async (req, res) => {
    let userId = req.params.userId;
    await update_user_schema_1.UpdateUserSchema.parseAsync(req.body);
    const update = req.body;
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new error_response_1.default(404, "user does not exist");
    }
    user.firstName = update.firstName;
    user.lastName = update.lastName;
    user.gender = update.gender;
    await user.save();
    return res.status(200).json(user);
});
exports.deleteUser = (0, tryCatch_utils_1.default)(async (req, res) => {
    let userId = req.params.userId;
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new error_response_1.default(404, "User does not exist");
    }
    await user.deleteOne();
    return res.status(200).json(user);
});
//# sourceMappingURL=users.controller.js.map