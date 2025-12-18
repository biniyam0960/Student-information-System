import express from "express";
import { body } from "express-validator";
import { authMiddleware } from "../middleware/auth.js";
import { register, login, me } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validate.js";

export const authRouter = express.Router();

// Public registration (no JWT required). Controller will force non-admins to student role.
authRouter.post(
  "/register",
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

authRouter.get("/me", authMiddleware, me);

