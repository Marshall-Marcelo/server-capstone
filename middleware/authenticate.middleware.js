import jwt from "jsonwebtoken";
import { AppError, HttpStatusCodes } from "./errorHandler.middleware.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authorization token is missing or invalid.", HttpStatusCodes.Forbidden);
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.TOKEN, (err, decoded) => {
    if (err) {
      const errorMessage = err.name === "TokenExpiredError" ? "Your session has expired. Please log in again." : "Invalid token. Access denied.";
      throw new AppError(errorMessage, HttpStatusCodes.Forbidden);
    }

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  });
};
