import express from "express";
import { getGenresController } from "../controller/genres.controller.js";

export const router = express.Router();

router.get("/", getGenresController);
