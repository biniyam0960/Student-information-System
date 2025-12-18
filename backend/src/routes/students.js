import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import {
  createStudentValidators,
  updateStudentValidators,
  createStudentHandler,
  listStudentsHandler,
  getStudentHandler,
  updateStudentHandler,
  deleteStudentHandler,
} from "../controllers/studentController.js";

export const studentRouter = express.Router();

// All student routes require authentication
studentRouter.use(authMiddleware);

// Admin and teachers can list all students
studentRouter.get(
  "/",
  requireRole("admin", "teacher"),
  listStudentsHandler
);

// Admin can create student records
studentRouter.post(
  "/",
  requireRole("admin"),
  createStudentValidators,
  validateRequest,
  createStudentHandler
);

// Admin and teachers can get any student, students can get their own (extra check in controller)
studentRouter.get(
  "/:id",
  requireRole("admin", "teacher", "student"),
  getStudentHandler
);

// Admin can update student records
studentRouter.put(
  "/:id",
  requireRole("admin"),
  updateStudentValidators,
  validateRequest,
  updateStudentHandler
);

// Admin can delete student records
studentRouter.delete(
  "/:id",
  requireRole("admin"),
  deleteStudentHandler
);


