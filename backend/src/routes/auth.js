import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { db } from "./config/mockDb.js";
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
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SIS backend API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/students", studentRouter);
app.use("/api/courses", courseRouter);
app.use("/api/sections", sectionRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/grades", gradeRouter);
app.use("/api/attendance", attendanceRouter);

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

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

