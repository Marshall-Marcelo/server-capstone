import express from "express";
import { requireRole, verifyAuth } from "../middleware/auth.middleware.js";
import { createTrainerAccountController, editTrainerAccountController, getTrainersController } from "../controller/accounts.controller.js";

export const router = express.Router();

router.get("/trainers", verifyAuth, getTrainersController);
router.post("/trainer", verifyAuth, requireRole("head"), createTrainerAccountController);
router.patch("/trainer", verifyAuth, requireRole("head"), editTrainerAccountController);

export default router;
