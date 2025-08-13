import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { AppError, HttpStatusCodes } from "../middleware/errorHandler.middleware.js";
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from "../services/department.service.js";
import { storage } from "../utils/appwriteconfig.js";
import { getFileId } from "../utils/general.utils.js";

export const createDepartmentController = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { imageUrl } = req;

  const newDepartment = await createDepartment({ name, logoUrl: imageUrl });

  res.status(HttpStatusCodes.Created).json({ ...newDepartment });
});

export const getDepartmentListController = asyncHandler(async (req, res, next) => {
  const departments = await getDepartments();
  res.json(departments);
});

export const deleteDepartmentController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const dep = await deleteDepartment(id);

  await storage.deleteFile(process.env.APP_WRITE_BUCKET_ID, getFileId(dep.logoUrl));

  res.json({ message: "Deleted" });
});

export const editDepartmentController = asyncHandler(async (req, res, next) => {
  const { departmentId, name } = req.body;
  const { imageUrl } = req;

  if (!departmentId || !name) {
    throw new AppError("Missing Post Fields", HttpStatusCodes.BadRequest);
  }

  await updateDepartment({ departmentId, name, logoUrl: imageUrl });
  res.json({ message: "Updated" });
});
