import express from "express";
import {
  archiveShowController,
  createShowController,
  getShowController,
  getShowsController,
  unArchiveShowController,
  getArchivedShowsController,
} from "../controller/show.controller.js";
import { requireRole, verifyAuth } from "../middleware/auth.middleware.js";
import upload from "../utils/upload.js";
import { uploadMediaMiddleware } from "../middleware/uploadMedia.middleware.js";

export const router = express.Router();

router.post("/", verifyAuth, requireRole("head", "trainer"), upload.single("image"), uploadMediaMiddleware, createShowController);
router.post("/archive", verifyAuth, requireRole("head", "trainer"), archiveShowController);
router.post("/unarchive", verifyAuth, requireRole("head", "trainer"), unArchiveShowController);
router.post("/delete", verifyAuth, requireRole("head", "trainer"), unArchiveShowController);

router.get("/:id", verifyAuth, getShowController);
router.get("/", verifyAuth, getShowsController);
router.get("/archived", getArchivedShowsController);
