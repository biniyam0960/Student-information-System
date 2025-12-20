import express from "express";
import { body } from "express-validator";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { register, login, me, changePassword } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validate.js";

export const authRouter = express.Router();

// Admin-only registration
authRouter.post(
  "/register",
  authMiddleware,
  requireRole("admin"),
  body("username").isString().isLength({ min: 3 }).trim(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("role").optional().isIn(["student", "teacher", "admin"]),
  body("first_name").isString().notEmpty().trim(),
  body("last_name").isString().notEmpty().trim(),
  validateRequest,
  register
);

authRouter.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
  validateRequest,
  login
);

// Student password change
authRouter.put(
  "/change-password",
  authMiddleware,
  requireRole("student"),
  body("currentPassword").isString().notEmpty(),
  body("newPassword").isLength({ min: 6 }),
  validateRequest,
  changePassword
);

authRouter.get("/me", authMiddleware, me);

