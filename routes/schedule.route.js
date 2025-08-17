import express from "express";
import {
  addShowScheduleController,
  getScheduleInfoController,
  getScheudleSummaryController,
  getShowSchedulesController,
} from "../controller/schedule.controller.js";
import { requireRole, verifyAuth } from "../middleware/auth.middleware.js";

export const router = express.Router();

router.post("/", verifyAuth, requireRole("head", "trainer"), addShowScheduleController);

router.get("/", verifyAuth, requireRole("head", "trainer"), getShowSchedulesController);

router.get("/:scheduleId", verifyAuth, requireRole("head", "trainer"), getScheduleInfoController);
router.get("/summary/:scheduleId", verifyAuth, requireRole("head", "trainer"), getScheudleSummaryController);
