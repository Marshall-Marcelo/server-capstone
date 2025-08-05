import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js";
import { router as departmentRoute } from "./routes/department.route.js";
import { router as showRoute } from "./routes/show.route.js";
import { router as scheduleRoute } from "./routes/schedule.route.js";
import { router as genresRoute } from "./routes/genres.route.js";
import { router as customerRoutes } from "./routes/customer.route.js";

import { errorHandler } from "./middleware/errorHandler.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/department", departmentRoute);
app.use("/api/show", showRoute);
app.use("/api/schedule", scheduleRoute);
app.use("/api/genres", genresRoute);
app.use("/api/customer", customerRoutes);

app.get("/", (req, res) => {
  res.send("Hello ESM!");
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
