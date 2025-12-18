import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import {
  enrollmentValidators,
  enrollInSectionHandler,
  dropEnrollmentHandler,
  listMyEnrollmentsHandler,
  listEnrollmentsBySectionHandler,
} from "../controllers/enrollmentController.js";

export const enrollmentRouter = express.Router();

enrollmentRouter.use(authMiddleware);

// Students: enroll, drop, list own enrollments
enrollmentRouter.post(
  "/",
  requireRole("student"),
  enrollmentValidators,
  validateRequest,
  enrollInSectionHandler
);

enrollmentRouter.post(
  "/drop",
  requireRole("student"),
  enrollmentValidators,
  validateRequest,
  dropEnrollmentHandler
);

enrollmentRouter.get(
  "/me",
  requireRole("student"),
  listMyEnrollmentsHandler
);

// Admin/teacher: list enrollments for a section
enrollmentRouter.get(
  "/section/:sectionId",
  requireRole("admin", "teacher"),
  listEnrollmentsBySectionHandler
);


