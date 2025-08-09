import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { getAllShowsForMenu, getDepartmentsForMenu, getSelectedShowDetails } from "../services/customer.service.js";
import { doesShowExist } from "../services/show.service.js";

export const getDataForMenuController = asyncHandler(async (req, res, next) => {
  const shows = await getAllShowsForMenu();
  const departments = await getDepartmentsForMenu();

  res.status(HttpStatusCodes.OK).json({
    shows,
    departments,
  });
});

export const getSelectedShowDataController = asyncHandler(async (req, res, next) => {
  const { showId } = req.params;

  const exists = await doesShowExist(showId);

  if (!exists) {
    throw new AppError("Show Not Found", HttpStatusCodes.NotFound);
  }

  const selectedShow = await getSelectedShowDetails(showId);

  const genreNames = selectedShow?.showgenre.map((g) => g.genre_showgenre_genreTogenre.name);

  const { showgenre, ...data } = selectedShow;

  res.status(HttpStatusCodes.OK).json({
    ...data,
    genreNames,
  });
});
