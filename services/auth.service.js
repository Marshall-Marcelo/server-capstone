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

export const createDistributorAccount = async ({ firstName, lastName, email, password, distributorType, contactNumber, departmentId }) => {
  const existingUser = await checkEmailExistence(email);

  if (existingUser) {
    throw new AppError("Email already used", HttpStatusCodes.Conflict);
  }

  const distributorData = {
    distributorTypeId: Number(distributorType),
    contactNumber,
  };

  if (Number(distributorType) === 2) {
    if (!departmentId) {
      throw new AppError("Department ID is required for distributor (CCA Member)", HttpStatusCodes.BadRequest);
    }

    const findDepartment = await prisma.department.findFirst({ where: { departmentId } });

    if (!findDepartment) {
      throw new AppError("Department ID not found", HttpStatusCodes.BadRequest);
    }

    distributorData.departmentId = departmentId;
  }

  const result = await prisma.users.create({
    data: {
      userId: crypto.randomUUID(),
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
      role: "distributor",
      distributor: {
        create: distributorData,
      },
    },
    include: {
      distributor: true,
    },
  });

  const { password: _, createdAt, isArchived, isLocked, distributor, ...userData } = result;
  const distributorDetails = distributor?.[0] ?? distributor;

  return {
    ...userData,
    ...distributorDetails,
  };
};
