import express from "express";
import {
  createCCAController,
  loginController,
  createDistributorAccountController,
  getUserInformationController,
} from "../controller/auth.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";

export const router = express.Router();

//should check if the adder is role of head
router.post("/newCCA", createCCAController);

router.post("/newDistributor", createDistributorAccountController);

router.post("/login", loginController);

router.get("/getUserInformation", verifyAuth, getUserInformationController);

router.post("/signin", (req, res) => {});

router.post("/signup", (req, res) => {});

export default router;
