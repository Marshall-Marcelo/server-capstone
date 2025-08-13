import express from "express";
import { loginController, getUserInformationController } from "../controller/auth.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";

export const router = express.Router();

router.post("/login", loginController);

router.get("/getUserInformation", verifyAuth, getUserInformationController);

export default router;
