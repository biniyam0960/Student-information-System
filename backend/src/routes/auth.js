<<<<<<< HEAD
/**
 * Authentication Routes - Express router for authentication endpoints
 * Handles HTTP routes for user login, registration, and auth-related operations
 * 
 * Note: This file is currently empty and needs implementation for:
 * - Login endpoint with credential validation
 * - Registration endpoint for new users
 * - Password reset endpoints
 * - Token refresh endpoints
 * - Logout endpoint
 */

import express from \"express\";\n// TODO: Import auth controllers when implemented\n// import { loginHandler, registerHandler, ... } from \"../controllers/authController.js\";\n\n// Create Express router for authentication routes\nexport const authRouter = express.Router();\n\n// TODO: Implement authentication routes\n// POST /api/auth/login - User login\n// POST /api/auth/register - User registration  \n// POST /api/auth/refresh - Refresh JWT token\n// POST /api/auth/logout - User logout\n// POST /api/auth/forgot-password - Initiate password reset\n// POST /api/auth/reset-password - Complete password reset\n\n/**\n * Example route structure:\n * \n * authRouter.post(\"/login\", [\n *   body(\"email\").isEmail().normalizeEmail(),\n *   body(\"password\").isLength({ min: 1 }),\n *   validateRequest,\n *   loginHandler\n * ]);\n * \n * authRouter.post(\"/register\", [\n *   body(\"email\").isEmail().normalizeEmail(),\n *   body(\"password\").isLength({ min: 8 }),\n *   body(\"username\").isLength({ min: 3 }),\n *   validateRequest,\n *   registerHandler\n * ]);\n */
=======
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

// GET /api/auth/me
authRouter.get("/me", authMiddleware, me);
>>>>>>> c268119 (auth is done)
