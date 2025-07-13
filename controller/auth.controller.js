import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { login, createAccount, createDistributorAccount, getUser } from "../services/auth.service.js";
import { generateToken } from "../utils/token.utils.js";
import { validateEmail } from "../utils/validators.js";

export const loginController = asyncHandler(async (req, res) => {
  const { email, password, expectedRole } = req.body;

  if (!email || !password || !expectedRole) {
    throw new AppError("Email, password, and role are required", HttpStatusCodes.BadRequest);
  }

  if (expectedRole !== "distributor") {
    const emailCheck = validateEmail({ requiredDomain: "@slu.edu.ph", email });
    if (!emailCheck.valid) {
      throw new AppError(emailCheck.message, HttpStatusCodes.BadRequest);
    }
  }

  const user = await login({ email, password });

  if (user.isArchived || user.isLocked) {
    throw new AppError("Account is locked or archived", HttpStatusCodes.Forbidden);
  }

  if (user.role === "distributor") {
    throw new AppError("Unauthorized Account Role", HttpStatusCodes.Forbidden);
  }

  res.cookie("authToken", generateToken({ userId: user.userId, userRole: user.role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(HttpStatusCodes.OK).json(user);
});

export const getUserInformationController = asyncHandler(async (req, res, next) => {
  const user = await getUser({ userId: req.user.userId });

  res.status(HttpStatusCodes.OK).json({ ...user });
});

/**
 *
 * New CCA Account - (either Trainer or Head)
 *
 * type = trainer or head
 */
export const createCCAController = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, type } = req.body;

  if (!firstName || !lastName || !email || !password || !type) {
    throw new AppError("Missing Post Fields", HttpStatusCodes.BadRequest);
  }

  const emailCheck = validateEmail({ requiredDomain: "@slu.edu.ph", email });

  if (!emailCheck.valid) {
    throw new AppError(emailCheck.message, HttpStatusCodes.BadRequest);
  }

  const newTrainer = await createAccount({ firstName, lastName, userType: type, email, password });
  res.status(HttpStatusCodes.Created).json({ message: "CCA Account Create Successfully", newTrainer });
});

export const createDistributorAccountController = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, password, distributorType, contactNumber, departmentId } = req.body;

  if (!firstName || !lastName || !email || !password || !distributorType || !contactNumber) {
    throw new AppError("Missing Post Fields", HttpStatusCodes.BadRequest);
  }

  let emailCheck;

  // CCA Member type ID on the database
  if (distributorType == 2) {
    emailCheck = validateEmail({ requiredDomain: "@slu.edu.ph", email });

    if (!departmentId) {
      throw new AppError("Please specify department for a CCA Member type of distributor", HttpStatusCodes.BadRequest);
    }
  } else {
    emailCheck = validateEmail({ email });
  }

  if (!emailCheck.valid) {
    throw new AppError(emailCheck.message, HttpStatusCodes.BadRequest);
  }

  const newAccount = await createDistributorAccount({ firstName, lastName, email, password, distributorType, contactNumber, departmentId });

  res.status(HttpStatusCodes.Created).json({ message: "Distributor Account Successfully Created", newAccount });
});
