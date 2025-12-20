import express from "express";
import { requireRole, authMiddleware } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import {
  createCourseValidators,
  updateCourseValidators,
  createCourseHandler,
  listCoursesHandler,
  getCourseHandler,
  updateCourseHandler,
  deleteCourseHandler,
} from "../controllers/courseController.js";

export const courseRouter = express.Router();

courseRouter.get("/", authMiddleware, listCoursesHandler);
courseRouter.get("/:id", authMiddleware, getCourseHandler);


courseRouter.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  createCourseValidators,
  validateRequest,
  createCourseHandler
);

courseRouter.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  updateCourseValidators,
  validateRequest,
  updateCourseHandler
);

courseRouter.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteCourseHandler
);


