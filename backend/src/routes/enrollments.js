/**
 * Enrollment Routes - Express router for student enrollment management endpoints
 * Handles HTTP routes for enrollment, waitlisting, and enrollment tracking
 */

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

enrollmentRouter.get(
  "/section/:sectionId",
  requireRole("admin", "teacher"),
  listEnrollmentsBySectionHandler
);


