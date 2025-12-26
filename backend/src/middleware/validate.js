/**
 * Request Validation Middleware
 * Provides centralized validation error handling for Express routes
 */

import { validationResult } from "express-validator";

/**
 * Middleware function to validate request data using express-validator
 * Checks for validation errors and returns 400 status with error details if found
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function validateRequest(req, res, next) {
  // Extract validation errors from request
  const errors = validationResult(req);
  
  // If validation errors exist, return 400 Bad Request
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // No validation errors, proceed to next middleware
  next();
}


