import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoute from "./routes/auth.route.js";
import { router as departmentRoute } from "./routes/department.route.js";
import { router as showRoute } from "./routes/show.route.js";

import { errorHandler } from "./middleware/errorHandler.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoute);
app.use("/department", departmentRoute);
app.use("/api/show", showRoute);

app.get("/", (req, res) => {
  res.send("Hello ESM!");
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
