import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import {
  createAssignmentValidators,
  gradeValidators,
  createAssignmentHandler,
  listAssignmentsForSectionHandler,
  upsertGradeHandler,
  mySectionGradesHandler,
  myGpaHandler,
} from "../controllers/gradeController.js";

export const gradeRouter = express.Router();

gradeRouter.use(authMiddleware);


gradeRouter.post(
  "/assignments",
  requireRole("teacher", "admin"),
  createAssignmentValidators,
  validateRequest,
  createAssignmentHandler
);

gradeRouter.get(
  "/assignments/:sectionId",
  requireRole("teacher", "admin"),
  listAssignmentsForSectionHandler
);

gradeRouter.post(
  "/grades",
  requireRole("teacher", "admin"),
  gradeValidators,
  validateRequest,
  upsertGradeHandler
);


gradeRouter.get(
  "/my/sections/:sectionId",
  requireRole("student"),
  mySectionGradesHandler
);

gradeRouter.get(
  "/my/gpa",
  requireRole("student"),
  myGpaHandler
);


