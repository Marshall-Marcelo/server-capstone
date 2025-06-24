import { asyncHanlder } from "../middleware/asyncHandler.middleware.js";
import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { createTrainerAccountService } from "../services/auth.services.js";
import { validateEmail } from "../utils/validators.js";

export const createTrainerController = asyncHanlder(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new AppError("Missing Post Fields", HttpStatusCodes.BadRequest);
  }

  const emailCheck = validateEmail({ requiredDomain: "@slu.edu.ph", email });

  if (!emailCheck.valid) {
    throw new AppError(emailCheck.message, HttpStatusCodes.BadRequest);
  }

  const newTrainer = await createTrainerAccountService({ firstName, lastName, userTypeId: 1, email, password });
  res.status(HttpStatusCodes.Created).json({ message: "Trainer Account Create Successfully", newTrainer });
});
