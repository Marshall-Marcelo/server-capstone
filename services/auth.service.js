import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";
import prisma from "../utils/primsa.connection.js";

/**
 * Checks if email is on the database
 */
export const checkEmailExistence = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
    include: {
      distributor: {
        select: {
          contactNumber: true,
          distributortypes: {
            select: {
              id: true,
              name: true,
            },
          },
          department: {
            select: {
              departmentId: true,
              name: true,
            },
          },
        },
      },
      department: {
        select: {
          departmentId: true,
          name: true,
        },
      },
    },
  });
};

export const login = async ({ email, password }) => {
  const userData = await checkEmailExistence(email);

  if (!userData) {
    throw new AppError("Wrong email or password", HttpStatusCodes.Forbidden);
  }

  const isPasswordValid = await verifyPassword(password, userData.password);
  if (!isPasswordValid) {
    throw new AppError("Wrong email or password", HttpStatusCodes.Forbidden);
  }

  const { password: _, isArchived, isLocked, createdAt, ...safeUserData } = userData;

  return safeUserData;
};

export const getUser = async ({ userId }) => {
  return await prisma.users.findFirst({
    where: { userId },
    select: {
      userId: true,
      role: true,
      email: true,
      firstName: true,
      lastName: true,
      distributor: {
        select: {
          contactNumber: true,
          distributortypes: {
            select: {
              id: true,
              name: true,
            },
          },
          department: {
            select: {
              departmentId: true,
              name: true,
            },
          },
        },
      },
      department: {
        select: {
          departmentId: true,
          name: true,
        },
      },
    },
  });
};

export const createAccount = async ({ firstName, lastName, userType, email, password }) => {
  const user = await checkEmailExistence(email);

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
