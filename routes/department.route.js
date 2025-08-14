import express from "express";
import {
  createDepartmentController,
  deleteDepartmentController,
  editDepartmentController,
  getDepartmentListController,
  removeDepartmentTrainerController,
} from "../controller/department.controller.js";
import { requireRole, verifyAuth } from "../middleware/auth.middleware.js";
import upload from "../utils/upload.js";
import { updateWithReplace, uploadMediaMiddleware } from "../middleware/uploadMedia.middleware.js";

export const router = express.Router();

router.post("/", verifyAuth, requireRole("head"), upload.single("image"), uploadMediaMiddleware, createDepartmentController);

router.patch("/", verifyAuth, requireRole("head"), upload.single("image"), updateWithReplace, editDepartmentController);
router.patch("/remove-trainer", verifyAuth, requireRole("head"), removeDepartmentTrainerController);

router.get("/", getDepartmentListController);

router.delete("/:id", verifyAuth, requireRole("head"), deleteDepartmentController);
