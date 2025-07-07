import { asyncHanlder } from "../middleware/asyncHandler.middleware.js";
import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { createShow } from "../services/show.service.js";

export const createShowController = asyncHanlder(async (req, res, next) => {
  const { showTitle, description, department, genre, createdBy, showType } = req.body;

  const file = req.file;
  if (!file) throw new AppError("Image is required", HttpStatusCodes.BadRequest);

  if (!showTitle || !description || !department || !genre || !createdBy || !showType) {
    throw new AppError("Missing Post Fields", HttpStatusCodes.BadRequest);
  }

  const cleanedGenres = genre
    .split(",")
    .map((g) => g.trim())
    .filter((g) => g !== "");

  const newShow = await createShow({ showTitle, coverImage: file.buffer, description, department, genre: cleanedGenres, createdBy, showType });
  res.status(HttpStatusCodes.Created).json({ message: "Show Created", newShow });
});

export const getShowsController = asyncHanlder(async (req, res, next) => {});
