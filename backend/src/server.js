import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { authRouter } from "./routes/auth.js";
import { studentRouter } from "./routes/students.js";
import { courseRouter } from "./routes/courses.js";
import { sectionRouter } from "./routes/sections.js";
import { enrollmentRouter } from "./routes/enrollments.js";
import { gradeRouter } from "./routes/grades.js";
import { attendanceRouter } from "./routes/attendance.js";
import { teacherRouter } from "./routes/teachers.js";
import { departmentRouter } from "./routes/departments.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/students", studentRouter);
app.use("/api/teachers", teacherRouter);
app.use("/api/courses", courseRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/sections", sectionRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/grades", gradeRouter);
app.use("/api/attendance", attendanceRouter);

app.get("/", (req, res) => {
  res.json({ message: "SIS backend API is running" });
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});