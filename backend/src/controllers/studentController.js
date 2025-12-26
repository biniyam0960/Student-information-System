import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentByUserId,
  updateStudent,
  deleteStudent,
  getStudentsByStatus,
} from "../models/studentModel.js";
import {
  findUserByEmail,
  createUser,
} from "../models/userModel.js";

/**
 * Student Controller - Handles student management operations
 * Professional, secure student management for the Student Information System
 */

/**
 * Validation rules for student creation
 */
export const createStudentValidators = [
  body("username").isString().isLength({ min: 3, max: 50 }).trim()
    .withMessage("Username must be 3-50 characters"),
  body("email").isEmail().normalizeEmail()
    .withMessage("Valid email is required"),
  body("password").isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("first_name").isString().isLength({ min: 1, max: 50 }).trim()
    .withMessage("First name is required (max 50 characters)"),
  body("last_name").isString().isLength({ min: 1, max: 50 }).trim()
    .withMessage("Last name is required (max 50 characters)"),
  body("student_ID_number").isString().isLength({ min: 1, max: 20 }).trim()
    .withMessage("Student ID number is required (max 20 characters)"),
  body("date_of_birth").isISO8601().toDate()
    .withMessage("Valid date of birth is required (YYYY-MM-DD)"),
  body("gender").isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
  body("address").isString().isLength({ min: 1, max: 200 }).trim()
    .withMessage("Address is required (max 200 characters)"),
  body("current_status").isIn(["active", "inactive", "graduated", "suspended"])
    .withMessage("Status must be active, inactive, graduated, or suspended"),
];

/**
 * Validation rules for student updates
 */
export const updateStudentValidators = [
  body("student_ID_number").optional().isString().isLength({ min: 1, max: 20 }).trim(),
  body("date_of_birth").optional().isISO8601().toDate(),
  body("gender").optional().isIn(["male", "female", "other"]),
  body("address").optional().isString().isLength({ min: 1, max: 200 }).trim(),
  body("current_status").optional().isIn(["active", "inactive", "graduated", "suspended"]),
];

/**
 * Creates complete student (user + student profile)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function createStudentHandler(req, res, next) {
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
      email,
      password,
      first_name,
      last_name,
      student_ID_number,
      date_of_birth,
      gender,
      address,
      current_status = "active",
    } = req.body;

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await createUser({
      username,
      passwordHash,
      email,
      role: "student",
      firstName: first_name,
      lastName: last_name,
    });

    const student = await createStudent({
      userId: user.user_ID,
      studentIdNumber: student_ID_number,
      dateOfBirth: date_of_birth,
      gender,
      address,
      currentStatus: current_status,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: {
        user: {
          user_ID: user.user_ID,
          username: user.username,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
        },
        student
      }
    });
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({
      success: false,
      message: "Internal server error during student creation"
    });
  }
}

/**
 * Lists all students (admin/teacher only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function listStudentsHandler(req, res, next) {
  try {
    const { status } = req.query;
    
    let students;
    if (status && ["active", "inactive", "graduated", "suspended"].includes(status)) {
      students = await getStudentsByStatus(status);
    } else {
      students = await getAllStudents();
    }

    res.json({
      success: true,
      message: "Students retrieved successfully",
      data: {
        students,
        count: students.length
      }
    });
  } catch (err) {
    console.error('Error listing students:', err);
    res.status(500).json({
      success: false,
      message: "Internal server error while retrieving students"
    });
  }
}

/**
 * Gets single student by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function getStudentHandler(req, res, next) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID"
      });
    }
    
    const student = await getStudentById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    if (req.user.role === "student") {
      const ownStudent = await getStudentByUserId(req.user.userId);
      if (!ownStudent || ownStudent.student_ID !== Number(id)) {
        return res.status(403).json({
          success: false,
          message: "Access denied - you can only view your own record"
        });
      }
    }

    res.json({
      success: true,
      message: "Student retrieved successfully",
      data: { student }
    });
  } catch (err) {
    console.error('Error getting student:', err);
    res.status(500).json({
      success: false,
      message: "Internal server error while retrieving student"
    });
  }
}

/**
 * Updates student information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function updateStudentHandler(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID"
      });
    }

    const existing = await getStudentById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const updated = await updateStudent(id, req.body);
    if (!updated) {
      return res.status(500).json({
        success: false,
        message: "Failed to update student"
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully",
      data: { student: updated }
    });
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({
      success: false,
      message: "Internal server error during student update"
    });
  }
}

/**
 * Deletes a student
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function deleteStudentHandler(req, res, next) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID"
      });
    }
    
    const existing = await getStudentById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const deleted = await deleteStudent(id);
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete student"
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({
      success: false,
      message: "Internal server error during student deletion"
    });
  }
}