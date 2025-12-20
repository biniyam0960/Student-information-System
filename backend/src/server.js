import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import  db  from "./config/db.js";
import { authRouter } from "./routes/auth.js";
import { itemsRouter } from "./routes/items.js";
import { studentRouter } from "./routes/students.js";
import { courseRouter } from "./routes/courses.js";
import { sectionRouter } from "./routes/sections.js";
import { enrollmentRouter } from "./routes/enrollments.js";
import { gradeRouter } from "./routes/grades.js";
import { attendanceRouter } from "./routes/attendance.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "SIS backend API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/items", itemsRouter);
app.use("/api/students", studentRouter);
app.use("/api/courses", courseRouter);
app.use("/api/sections", sectionRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/grades", gradeRouter);
app.use("/api/attendance", attendanceRouter);


app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Server error" });
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

