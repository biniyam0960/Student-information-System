import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import {
  createTeacherValidators,
  updateTeacherValidators,
  createTeacherHandler,
  listTeachersHandler,
  getTeacherHandler,
  updateTeacherHandler,
  deleteTeacherHandler,
} from "../controllers/teacherController.js";

export const teacherRouter = express.Router();

teacherRouter.use(authMiddleware);

teacherRouter.get("/", requireRole("admin"), listTeachersHandler);

teacherRouter.post(
  "/",
  requireRole("admin"),
  createTeacherValidators,
  validateRequest,
  createTeacherHandler
);

teacherRouter.get("/:id", requireRole("admin", "teacher"), getTeacherHandler);

teacherRouter.put(
  "/:id",
  requireRole("admin"),
  updateTeacherValidators,
  validateRequest,
  updateTeacherHandler
);

teacherRouter.delete("/:id", requireRole("admin"), deleteTeacherHandler);