import { AppError, HttpStatusCodes } from "./errorHandler.middleware.js";
import { asyncHandler } from "./asyncHandler.middleware.js";
import { storage } from "../utils/appwriteconfig.js";
import { InputFile } from "node-appwrite/file";

export const uploadMediaMiddleware = asyncHandler(async (req, res, next) => {
  const file = req.file;
  if (!file) throw new AppError("Image is required", HttpStatusCodes.BadRequest);

  const allowedTypes = ["image/jpeg", "image/png"];
  const maxFileSize = 5 * 1024 * 1024;

  const isValidType = allowedTypes.includes(file.mimetype);
  if (!isValidType) {
    throw new AppError(`Invalid file type: ${file.originalname}. Allowed types: ${allowedTypes.join(", ")}`, HttpStatusCodes.BadRequest);
  }

  if (file.size > maxFileSize) {
    throw new AppError(`File size too large: ${file.originalname}. Max size is ${maxFileSize / 1024 / 1024} MB.`, HttpStatusCodes.BadRequest);
  }

  const result = await storage.createFile(process.env.APP_WRITE_BUCKET_ID, crypto.randomUUID(), InputFile.fromBuffer(file.buffer, file.originalname));
  const mediaURL = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.APP_WRITE_BUCKET_ID}/files/${result.$id}/view?project=${process.env.APP_WRITE_PROJECT_ID}&mode=admin`;

  req.imageUrl = mediaURL;
  next();
});
