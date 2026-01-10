<<<<<<< HEAD
/**
 * Student Information System (SIS) Backend Server
 * Main entry point for the Express.js application
 * Handles API routing, middleware setup, and database connection
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import  db  from "./config/db.js";

=======
// server.js





import express from "express";
import cors from "cors";
import dotenv from "dotenv";

>>>>>>> c268119 (auth is done)
import { authRouter } from "./routes/auth.js";
import { studentRouter } from "./routes/students.js";
import { courseRouter } from "./routes/courses.js";
import { sectionRouter } from "./routes/sections.js";
import { enrollmentRouter } from "./routes/enrollments.js";
import { gradeRouter } from "./routes/grades.js";
import { attendanceRouter } from "./routes/attendance.js";







dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ---------------------
// Middleware
// ---------------------
app.use(cors());
app.use(express.json());               // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

<<<<<<< HEAD
/**
 * Health check endpoint
 */
app.get("/", (req, res) => {
  res.json({ message: "SIS backend API is running" });
=======
// Simple request logger
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
>>>>>>> c268119 (auth is done)
});

// ---------------------
// Mount Routers
// ---------------------
app.use("/api/auth", authRouter);
app.use("/api/students", studentRouter);
app.use("/api/courses", courseRouter);
app.use("/api/sections", sectionRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/grades", gradeRouter);
app.use("/api/attendance", attendanceRouter);

<<<<<<< HEAD
/**
 * Global error handling middleware
 */
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Server error" });
});

/**
 * Database connection and server startup
 */
db.getConnection()
  .then((conn) => {
    conn.release();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MySQL:", err.message);
    process.exit(1);
  });
=======
// ---------------------
// Health check
// ---------------------
app.get("/", (req, res) => {
  res.json({ message: "SIS backend API is running" });
});

// ---------------------
// Catch-all 404 handler
// ---------------------
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found. Check your URL and HTTP method." });
});
>>>>>>> c268119 (auth is done)

// ---------------------
// Centralized Error Handler
// ---------------------
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// ---------------------
// Start server
// ---------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
