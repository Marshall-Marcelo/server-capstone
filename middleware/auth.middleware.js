import jwt from "jsonwebtoken";
import { AppError, HttpStatusCodes } from "./errorHandler.middleware.js";

export const verifyAuth = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return next(new AppError("Authentication required", HttpStatusCodes.Unauthorized));
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", HttpStatusCodes.Unauthorized));
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.userRole)) {
      return next(new AppError("Forbidden", HttpStatusCodes.Forbidden));
    }
    next();
  };
};
