import express from "express";
import { createShowController } from "../controller/show.controller.js";

export const router = express.Router();

//show check if account role is valid
router.post("/", createShowController);
