"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const error_response_1 = __importDefault(require("../utils/error-response"));
const requireAuth = async (req, res, next) => {
    try {
        const sessionToken = req.cookies["ec-book-cookie"];
        console.log(sessionToken);
        if (!sessionToken) {
            throw new error_response_1.default(401, "Please login to continue ...");
        }
        const user = await user_model_1.User.findOne({ "auth.sessionToken": sessionToken });
        if (!user) {
            throw new error_response_1.default(401, "Please login to continue ...");
        }
        if (user.auth.expiresAt < new Date()) {
            throw new error_response_1.default(401, "Your session has expired, Please login to continue ...");
        }
        return next();
    }
    catch (error) {
        return res.status(401).json(error);
    }
};
exports.default = requireAuth;
//# sourceMappingURL=require-auth.js.map