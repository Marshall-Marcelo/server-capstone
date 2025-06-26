import express from "express";
import { createCCAController, ccaLoginController, createDistributorAccountController } from "../controller/auth.controller.js";

export const router = express.Router();

//should check if the adder is role of head
router.post("/newCCA", createCCAController);

router.post("/newDistributor", createDistributorAccountController);

router.post("/ccaLogin", ccaLoginController);

router.post("/signin", (req, res) => {});

router.post("/signup", (req, res) => {});

export default router;
