import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { getAllShowsForMenu, getDepartmentsForMenu } from "../services/customer.service.js";

export const getDataForMenuController = asyncHandler(async (req, res, next) => {
  const shows = await getAllShowsForMenu();
  const departments = await getDepartmentsForMenu();

  res.status(HttpStatusCodes.OK).json({
    shows,
    departments,
  });
});
