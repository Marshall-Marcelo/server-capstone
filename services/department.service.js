import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import prisma from "../utils/primsa.connection.js";

const findDepartment = async (name) => {
  return prisma.department.findUnique({ where: { name } });
};

export const createDepartment = async ({ name }) => {
  const checkDepartmentName = await findDepartment(name);

  if (checkDepartmentName) {
    throw new AppError("Department name already exists", HttpStatusCodes.Conflict);
  }

  const newDepartment = await prisma.department.create({
    data: {
      departmentId: crypto.randomUUID(),
      name,
    },
  });

  return newDepartment;
};

export const getDepartments = async () => {
  const departments = await prisma.department.findMany({
    include: {
      users: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      _count: {
        select: {
          shows: true,
        },
      },
    },
  });

  const result = departments.map((dep) => ({
    departmentId: dep.departmentId,
    name: dep.name,
    trainerId: dep.trainerId,
    trainerName: dep.users ? `${dep.users.firstName} ${dep.users.lastName}` : null,
    totalShows: dep._count.shows,
  }));

  return result;
};
