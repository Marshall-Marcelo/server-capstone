import express from "express";
import { getDataForMenuController } from "../controller/customer.controller";

export const router = express.Router();

router.get("/", getDataForMenuController);
