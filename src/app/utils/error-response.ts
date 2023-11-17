// type HttpCode = 400 | 401 | 403 | 404 | 409 | 422 | 500;

class ErrorResponse extends Error {
  public readonly status: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors: {}[];
  constructor(statusCode: number, message: string, errors: {}[] = null) {
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

export default ErrorResponse;
