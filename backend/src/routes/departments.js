import express from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import {
  createDepartmentValidators,
  updateDepartmentValidators,
  createDepartmentHandler,
  listDepartmentsHandler,
  getDepartmentHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler,
} from "../controllers/departmentController.js";

export const departmentRouter = express.Router();

departmentRouter.use(authMiddleware);

departmentRouter.get("/", listDepartmentsHandler);

departmentRouter.post(
  "/",
  requireRole("admin"),
  createDepartmentValidators,
  validateRequest,
  createDepartmentHandler
);

departmentRouter.get("/:id", getDepartmentHandler);

departmentRouter.put(
  "/:id",
  requireRole("admin"),
  updateDepartmentValidators,
  validateRequest,
  updateDepartmentHandler
);

departmentRouter.delete("/:id", requireRole("admin"), deleteDepartmentHandler);