import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import prisma from "../utils/primsa.connection.js";
import { checkEmailExistence } from "./auth.service.js";

export const getTrainers = async () => {
  return await prisma.users.findMany({
    where: { role: "trainer" },
    include: {
      department: {
        select: {
          name: true,
          departmentId: true,
        },
      },
    },
  });
};

export const editAccount = async ({ userId, firstName, lastName, email }) => {
  const user = await checkEmailExistence(email);

  if (user && user.userId !== userId) {
    throw new AppError("Email already used", HttpStatusCodes.Conflict);
  }

  return await prisma.users.update({
    where: {
      userId,
    },
    data: {
      firstName,
      lastName,
      email,
    },
  });
};
