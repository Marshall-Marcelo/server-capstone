import express from "express";
import { getDataForMenuController, getSelectedShowDataController } from "../controller/customer.controller.js";

export const router = express.Router();

router.get("/", getDataForMenuController);
router.get("/:showId", getSelectedShowDataController);
