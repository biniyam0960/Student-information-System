
import express from "express";
import { body } from "express-validator";
import { register, login, me } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";

export const authRouter = express.Router();

// POST /api/auth/register
authRouter.post(
  "/register",
  body("username").isString().isLength({ min: 3 }).trim(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("first_name").isString().notEmpty().trim(),
  body("last_name").isString().notEmpty().trim(),
  validateRequest,
  register
);

// POST /api/auth/login
authRouter.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
  validateRequest,
  login
);
