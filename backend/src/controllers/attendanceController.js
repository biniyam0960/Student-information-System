/**
 * Attendance Controller - HTTP request handlers for attendance management
 * Handles attendance recording and retrieval with proper validation
 */

import { body } from "express-validator";
import { getStudentByUserId } from "../models/studentModel.js";
import {
  markAttendance,
  listAttendanceForSectionOnDate,
  listAttendanceForStudent,
} from "../models/attendanceModel.js";

/**
 * Validation rules for attendance marking
 */
export const markAttendanceValidators = [
  body("section_ID").isInt({ gt: 0 }),
  body("student_ID").isInt({ gt: 0 }),
  body("date").isISO8601().toDate(),
  body("status").isIn(["present", "absent", "late"]),
];

/**
 * Records attendance for a student in a section
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function markAttendanceHandler(req, res, next) {
  try {
    const record = await markAttendance(req.body);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves attendance records for a section on a specific date
 * @param {Object} req - Express request object (contains section ID and date)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function listSectionAttendanceHandler(req, res, next) {
  try {
    const { sectionId } = req.params;
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: "date query parameter is required" });
    }
    
    const records = await listAttendanceForSectionOnDate(sectionId, date);
    res.json(records);
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves all attendance records for the authenticated student
 * @param {Object} req - Express request object (contains authenticated user)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function myAttendanceHandler(req, res, next) {
  try {
    const student = await getStudentByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ error: "No student record for user" });
    }
    
    const records = await listAttendanceForStudent(student.student_ID);
    res.json(records);
  } catch (err) {
    next(err);
  }
}


