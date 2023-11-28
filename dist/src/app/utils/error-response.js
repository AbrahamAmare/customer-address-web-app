"use strict";
// type HttpCode = 400 | 401 | 403 | 404 | 409 | 422 | 500;
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorResponse extends Error {
    status;
    statusCode;
    isOperational;
    errors;
    constructor(statusCode, message, errors = null) {
        super();
        this.message = message;
        this.status =
            statusCode >= 400 && statusCode < 500 ? "Failed" : "Unhandled Error";
        this.statusCode = statusCode;
        this.isOperational = true;
        this.errors = errors;
        Error.captureStackTrace(this);
    }
}
exports.default = ErrorResponse;
//# sourceMappingURL=error-response.js.map