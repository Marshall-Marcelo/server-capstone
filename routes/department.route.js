import express from "express";
import { createDepartmentController } from "../controller/department.controller.js";

export const router = express.Router();

//should add middleware to check role if head
router.post("/new", createDepartmentController);
