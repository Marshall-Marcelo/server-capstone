import express from "express";
import { createShowController } from "../controller/show.controller.js";
import { requireRole, verifyAuth } from "../middleware/auth.middleware.js";
import upload from "../utils/upload.js";

export const router = express.Router();

router.post("/", verifyAuth, requireRole("head", "trainer"), upload.single("image"), createShowController);

router.get("/", verifyAuth, createShowController);
