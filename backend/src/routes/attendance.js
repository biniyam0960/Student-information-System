import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import {
  markAttendanceValidators,
  markAttendanceHandler,
  listSectionAttendanceHandler,
  myAttendanceHandler,
} from "../controllers/attendanceController.js";

export const attendanceRouter = express.Router();

attendanceRouter.use(authMiddleware);


attendanceRouter.post(
  "/",
  requireRole("teacher", "admin"),
  markAttendanceValidators,
  validateRequest,
  markAttendanceHandler
);

attendanceRouter.get(
  "/section/:sectionId",
  requireRole("teacher", "admin"),
  listSectionAttendanceHandler
);


attendanceRouter.get(
  "/my",
  requireRole("student"),
  myAttendanceHandler
);


