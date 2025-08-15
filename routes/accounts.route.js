import express from "express";
import { requireRole, verifyAuth } from "../middleware/auth.middleware.js";
import {
  createDistributorAccountController,
  createTrainerAccountController,
  editTrainerAccountController,
  getDistributorsController,
  getDistributorTypesController,
  getTrainersController,
  updateDistributorAccountController,
} from "../controller/accounts.controller.js";

export const router = express.Router();

router.get("/trainers", verifyAuth, getTrainersController);
router.get("/distributors", verifyAuth, getDistributorsController);
router.get("/distributorTypes", getDistributorTypesController);

router.post("/trainer", verifyAuth, requireRole("head"), createTrainerAccountController);
router.post("/distributor", verifyAuth, createDistributorAccountController);

router.patch("/trainer", verifyAuth, requireRole("head", "trainer"), editTrainerAccountController);
router.patch("/distributor", verifyAuth, updateDistributorAccountController);

export default router;
