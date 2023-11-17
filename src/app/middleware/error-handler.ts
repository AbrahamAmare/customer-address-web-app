import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/error-response";

const developmentErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    path: error.path,
    errors: error.errors,
    stack: error.stack,
  });
};

const productionErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    });
  } else {
    return res.status(500).json({
      status: "Failed",
      message: "Something unexpected went wrong... ",
    });
  }
};

const castErrorHandler = (error: any) => {
  const msg = `Invalid value for ${error.path}: ${error.value}!`;
  return new ErrorResponse(400, msg);
};

const duplicateKeyErrorHandler = (error: any) => {
  const name = error.keyValue.name;
  const msg = `This value is already taken ${name}. Please use another!`;

  return new ErrorResponse(409, msg);
};

const validationErrorHandler = (error: any) => {
  const errors = Object.values(error.errors).map((val: any) => val.message);
  const errorMessages = errors.join("; ");
  const msg = `Invalid input data: ${errorMessages}`;

  return new ErrorResponse(400, msg);
};

const schemaValidationError = (error: any) => {
  const errors = error.errors.map((val: any) => {
    return { field: val.path, message: val.message };
  });
  const msg = "One or more validation error has occurred";
  console.log(errors);
  return new ErrorResponse(422, msg, errors);
};

export default process.env.NODE_ENV === "development"
  ? developmentErrorHandler
  : productionErrorHandler;
