import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { getGenres } from "../services/genre.service.js";

export const getGenresController = asyncHandler(async (req, res) => {
  const genres = await getGenres();
  res.json({ genres });
});
