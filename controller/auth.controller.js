import { asyncHanlder } from "../middleware/asyncHandler.middleware.js";
import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { login, createAccount, createDistributorAccount } from "../services/auth.service.js";
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

  const user = await login({ email, password });

  if (user.isArchived || user.isLocked) {
    throw new AppError("Can't login account, (it is either locked or archived");
  }

  if (user.role == "none") {
    throw new AppError("Can't login this type of account", HttpStatusCodes.Forbidden);
  }

  const token = generateToken({ userId: user.userId, userRole: user.role });

  res.status(HttpStatusCodes.OK).json({ ...user, token });
});

/**
 *
 * New CCA Account - (either Trainer or Head)
 *
 * type = trainer or head
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

  const newTrainer = await createAccount({ firstName, lastName, userType: type, email, password });
  res.status(HttpStatusCodes.Created).json({ message: "CCA Account Create Successfully", newTrainer });
});

export const createDistributorAccountController = asyncHanlder(async (req, res, next) => {
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
