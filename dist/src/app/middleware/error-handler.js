"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = __importDefault(require("../utils/error-response"));
const developmentErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        path: error.path,
        errors: error.errors,
        stack: error.stack,
    });
};
const productionErrorHandler = (error, req, res, next) => {
    if (error.name === "ZodError") {
        error = schemaValidationError(error);
    }
    if (error.name === "CastError") {
        error = castErrorHandler(error);
    }
    if (error.code === 11000) {
        error = duplicateKeyErrorHandler(error);
    }
    if (error.name === "ValidationError") {
        error = validationErrorHandler(error);
    }
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
            errors: error.errors,
        });
    }
    else {
        return res.status(500).json({
            status: "Failed",
            message: "Something unexpected went wrong... ",
            errors: error.errors,
        });
    }
};
const castErrorHandler = (error) => {
    const msg = `Invalid value for ${error.path}: ${error.value}!`;
    return new error_response_1.default(400, msg);
};
const duplicateKeyErrorHandler = (error) => {
    const name = error.keyValue.name;
    const msg = `This value is already taken ${name}. Please use another!`;
    return new error_response_1.default(409, msg);
};
const validationErrorHandler = (error) => {
    const errors = Object.values(error.errors).map((val) => val.message);
    const errorMessages = errors.join("; ");
    const msg = `Invalid input data: ${errorMessages}`;
    return new error_response_1.default(400, msg);
};
const schemaValidationError = (error) => {
    const errors = error.errors.map((val) => {
        return { field: val.path, message: val.message };
    });
    const msg = "One or more validation error has occurred";
    return new error_response_1.default(422, msg, errors);
};
exports.default = process.env.NODE_ENV === "development"
    ? developmentErrorHandler
    : productionErrorHandler;
//# sourceMappingURL=error-handler.js.map