// src/index.js
// Entry point — boots Express and registers all routes.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "School Management API is running 🎓",
    endpoints: {
      addSchool: "POST /addSchool",
      listSchools: "GET  /listSchools?latitude=<lat>&longitude=<lon>",
    },
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/", schoolRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Something went wrong." });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Server running at http://localhost:${PORT}`);
});
