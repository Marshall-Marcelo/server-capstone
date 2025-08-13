import express from "express";
import {
  createDepartmentController,
  deleteDepartmentController,
  editDepartmentController,
  getDepartmentListController,
} from "../controller/department.controller.js";
import { requireRole, verifyAuth } from "../middleware/auth.middleware.js";
import upload from "../utils/upload.js";
import { updateWithReplace, uploadMediaMiddleware } from "../middleware/uploadMedia.middleware.js";

export const router = express.Router();

//should add middleware to check role if head
router.post("/", verifyAuth, requireRole("head"), upload.single("image"), uploadMediaMiddleware, createDepartmentController);
router.patch("/", verifyAuth, requireRole("head"), upload.single("image"), updateWithReplace, editDepartmentController);
router.get("/", getDepartmentListController);
router.delete("/:id", verifyAuth, requireRole("head"), deleteDepartmentController);
