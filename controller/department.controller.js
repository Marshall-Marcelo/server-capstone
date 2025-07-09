import { asyncHanlder } from "../middleware/asyncHandler.middleware.js";
import { HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { createDepartment, getDepartments } from "../services/department.service.js";

export const createDepartmentController = asyncHanlder(async (req, res, next) => {
  const { name } = req.body;

  const newDepartment = await createDepartment({ name });

  res.status(HttpStatusCodes.Created).json({ ...newDepartment });
});

export const getDepartmentListController = asyncHanlder(async (req, res, next) => {
  const departments = await getDepartments();
  res.json({ departments });
});
