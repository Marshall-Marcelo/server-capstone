import express from "express";
import { addShowScheduleController, getShowSchedulesController } from "../controller/schedule.controller.js";
import { requireRole, verifyAuth } from "../middleware/auth.middleware.js";

export const router = express.Router();

router.post("/", verifyAuth, requireRole("head", "trainer"), addShowScheduleController);

router.get("/", verifyAuth, requireRole("head", "trainer"), getShowSchedulesController);
