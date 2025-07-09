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
  return await prisma.department.findMany();
};
