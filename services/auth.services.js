import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";
import prisma from "../utils/primsa.connection.js";

export const checkEmailExistence = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

export const ccaLoginService = async ({ email, password }) => {
  const userData = await checkEmailExistence(email);

  if (!userData || !verifyPassword(password, userData.password)) {
    throw new AppError("Wrong email or password", HttpStatusCodes.Forbidden);
  }

  return userData;
};

export const createCCAAccountService = async ({ firstName, lastName, userType, email, password }) => {
  const user = await checkEmailExistence(email);

  console.log(user);

  if (user) {
    throw new AppError("Email already used", HttpStatusCodes.Conflict);
  }

  const newAccount = await prisma.users.create({
    data: {
      userId: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
      role: userType,
    },
  });

  const { password: _, createdAt, isArchived, isLocked, ...data } = newAccount;
  return data;
};
