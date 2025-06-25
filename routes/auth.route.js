import express from "express";
import { createCCAController, ccaLoginController } from "../controller/auth.controller.js";

export const router = express.Router();

router.post("/newCCA", createCCAController);
router.post("/ccaLogin", ccaLoginController);

router.post("/signin", (req, res) => {});

router.post("/signup", (req, res) => {});

export default router;
