import express from "express";
import { getDataForMenuController } from "../controller/customer.controller.js";

export const router = express.Router();

router.get("/", getDataForMenuController);
