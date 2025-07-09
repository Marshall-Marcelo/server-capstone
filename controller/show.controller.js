import { asyncHanlder } from "../middleware/asyncHandler.middleware.js";
import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { createShow, getShow, getShows } from "../services/show.service.js";

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

export const getShowController = asyncHanlder(async (req, res, next) => {
  const { id } = req.params;
  const show = await getShow({ id });

  console.log(id);

  const genreNames = show?.showgenre.map((g) => g.genre_showgenre_genreTogenre.name);

  const { showgenre, ...data } = show;

  res.status(HttpStatusCodes.OK).json({
    ...data,
    genreNames,
  });
});

export const getShowsController = asyncHanlder(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const departmentId = req.query.departmentId;
  const showType = req.query.showType;
  const search = req.query.search;

  const { shows, total, totalMajorConcert, totalShowCase } = await getShows({
    offSet: offset,
    limit,
    departmentId,
    showType,
    search,
  });

  res.json({
    shows,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    totalMajorConcert,
    totalShowCase,
  });
});
