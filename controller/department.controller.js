import { asyncHanlder } from "../middleware/asyncHandler.middleware.js";
import { HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { createDepartment } from "../services/department.service.js";

export const createDepartmentController = asyncHanlder(async (req, res, next) => {
  const { name } = req.body;

  const newDepartment = await createDepartment({ name });

  res.status(HttpStatusCodes.Created).json({ ...newDepartment });
});
