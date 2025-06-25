import { asyncHanlder } from "../middleware/asyncHandler.middleware.js";
import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { ccaLoginService, createCCAAccountService } from "../services/auth.services.js";
import { generateToken } from "../utils/token.utils.js";
import { validateEmail } from "../utils/validators.js";

/**
 *
 * CCA Login - (for trainer and head)
 */
export const ccaLoginController = asyncHanlder(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Username/Email and Password are required", HttpStatusCodes.BadRequest);
  }

  const emailCheck = validateEmail({ requiredDomain: "@slu.edu.ph", email });

  if (!emailCheck.valid) {
    throw new AppError(emailCheck.message, HttpStatusCodes.BadRequest);
  }

  const user = await ccaLoginService({ email, password });

  if (user.isArchived || user.isLocked) {
    throw new AppError("Can't login account, (it is either locked or archived");
  }

  if (user.role == "none") {
    throw new AppError("Can't login account (it is either locked or archived)", HttpStatusCodes.Forbidden);
  }

  const token = generateToken({ userId: user.userId, userRole: user.role });

  const { password: _, isArchived, isLocked, createdAt, ...safeUser } = user;

  res.status(HttpStatusCodes.OK).json({ ...safeUser, token });
});

/**
 *
 * New CCA Account - (either Trainer or Head)
 */
export const createCCAController = asyncHanlder(async (req, res, next) => {
  const { firstName, lastName, email, password, type } = req.body;

  if (!firstName || !lastName || !email || !password || !type) {
    throw new AppError("Missing Post Fields", HttpStatusCodes.BadRequest);
  }

  const emailCheck = validateEmail({ requiredDomain: "@slu.edu.ph", email });

  if (!emailCheck.valid) {
    throw new AppError(emailCheck.message, HttpStatusCodes.BadRequest);
  }

  const newTrainer = await createCCAAccountService({ firstName, lastName, userType: type, email, password });
  res.status(HttpStatusCodes.Created).json({ message: "CCA Account Create Successfully", newTrainer });
});
