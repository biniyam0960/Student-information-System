import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { signToken } from "../middleware/auth.js";
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserPassword,
} from "../models/userModel.js";

/**
 * Authentication Controller - Handles user authentication and password management
 * Secure, scalable authentication for the Student Information System
 */

// Admin-only user registration
export async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: "Validation failed",
        errors: errors.array() 
      });
    }

    const {
      username,
      password,
      email,
      role = "student",
      first_name,
      last_name,
    } = req.body;

    // Check for existing user
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ 
        success: false,
        message: "Email already registered" 
      });
    }

    // Hash password securely
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user account
    const user = await createUser({
      username,
      passwordHash,
      email,
      role,
      firstName: first_name,
      lastName: last_name,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user_ID: user.user_ID,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration"
    });
  }
}

// User login with JWT token
export async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: "Validation failed",
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = signToken({
      userId: user.user_ID,
      role: user.role,
      email: user.email,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          user_ID: user.user_ID,
          username: user.username,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: "Internal server error during login"
    });
  }
}

// Get current user profile
export async function me(req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized" 
      });
    }

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.json({
      success: true,
      data: {
        user_ID: user.user_ID,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    next(err);
  }
}

// Student password change
export async function changePassword(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: "Validation failed",
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Get user with password hash
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: "Current password is incorrect" 
      });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    const updated = await updateUserPassword(userId, newPasswordHash);

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: "Failed to update password"
      });
    }

    res.json({ 
      success: true,
      message: "Password changed successfully" 
    });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({
      success: false,
      message: "Internal server error during password change"
    });
  }
}