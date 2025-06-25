import jwt from "jsonwebtoken";
import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";

export const generateToken = ({ userId, userRole }) => {
  const secretKey = process.env.TOKEN_KEY;

  if (!secretKey) {
    throw new AppError("Please check ENV variable, secret token not found", HttpStatusCodes.InternalServerError);
  }

  return jwt.sign({ userId, userRole }, secretKey, { expiresIn: "6h" });
};
