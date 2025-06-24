import express from "express";
import { createTrainerController } from "../controller/auth.controller.js";

export const router = express.Router();

router.post("/newTrainer", createTrainerController);

router.post("/signin", (req, res) => {});

router.post("/signup", (req, res) => {});

export default router;
