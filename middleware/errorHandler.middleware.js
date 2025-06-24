export const HttpStatusCodes = {
  OK: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  Conflict: 409,
  UnprocessableEntity: 422,
  TooManyRequests: 429,
  InternalServerError: 500,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
};

export class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  const isDev = process.env.ENVIRONMENT !== "production";

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : "Something went wrong. Please try again later.";

  // Log error details
  if (isDev || !(err instanceof AppError)) {
    console.error("💥 Error:", {
      message: err.message,
      stack: err.stack,
      ...(err instanceof AppError && err.details && { details: err.details }),
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(isDev && { stack: err.stack }),
      ...(isDev && err instanceof AppError && err.details && { details: err.details }),
    },
  });
};
