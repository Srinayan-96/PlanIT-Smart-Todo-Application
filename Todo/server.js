const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3001",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Todo API is running",
    routes: [
      "/api/health",
      "/api/tasks",
      "/api/tasks/stats",
      "/api/tasks/alerts",
      "/api/tasks/activity-trend",
    ],
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

app.use(errorHandler);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

