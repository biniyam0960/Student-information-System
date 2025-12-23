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


studentRouter.use(authMiddleware);


studentRouter.get(
  "/",
  requireRole("admin", "teacher"),
  listStudentsHandler
);


studentRouter.post(
  "/",
  requireRole("admin"),
  createStudentValidators,
  validateRequest,
  createStudentHandler
);


studentRouter.get(
  "/:id",
  requireRole("admin", "teacher", "student"),
  getStudentHandler
);


studentRouter.put(
  "/:id",
  requireRole("admin"),
  updateStudentValidators,
  validateRequest,
  updateStudentHandler
);


studentRouter.delete(
  "/:id",
  requireRole("admin"),
  deleteStudentHandler
);


