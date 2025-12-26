/**
 * Enrollment Controller - HTTP request handlers for enrollment management
 * Handles student enrollment, waitlisting, and capacity management
 */

import { body } from "express-validator";
import { getStudentByUserId } from "../models/studentModel.js";
import {
  createEnrollment,
  getEnrollment,
  listEnrollmentsByStudent,
  listEnrollmentsBySection,
  updateEnrollmentStatus,
} from "../models/enrollmentModel.js";
import { getSectionById, countEnrolledInSection } from "../models/sectionModel.js";

/**
 * Validation rules for enrollment requests
 */
export const enrollmentValidators = [
  body("section_ID").isInt({ gt: 0 }),
];

/**
 * Enrolls a student in a section (handles capacity vs waitlist logic)
 * @param {Object} req - Express request object (contains section_ID and authenticated user)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function enrollInSectionHandler(req, res, next) {
  try {
    const student = await getStudentByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ error: "No student record for user" });
    }

    const { section_ID } = req.body;

    const section = await getSectionById(section_ID);
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    const existing = await getEnrollment(student.student_ID, section_ID);
    if (existing && existing.status === "enrolled") {
      return res.status(400).json({ error: "Already enrolled in this section" });
    }

    const enrolledCount = await countEnrolledInSection(section_ID);
    const status =
      enrolledCount < section.capacity ? "enrolled" : "waitlisted";

    const enrollment = await createEnrollment({
      student_ID: student.student_ID,
      section_ID,
      status,
    });

    res.status(201).json(enrollment);
  } catch (err) {
    next(err);
  }
}

/**
 * Drops a student's enrollment from a section
 * @param {Object} req - Express request object (contains section_ID and authenticated user)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function dropEnrollmentHandler(req, res, next) {
  try {
    const student = await getStudentByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ error: "No student record for user" });
    }
    
    const { section_ID } = req.body;

    const existing = await getEnrollment(student.student_ID, section_ID);
    if (!existing) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    const updated = await updateEnrollmentStatus(
      existing.enrollment_ID,
      "dropped"
    );
    
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves all enrollments for the authenticated student
 * @param {Object} req - Express request object (contains authenticated user)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function listMyEnrollmentsHandler(req, res, next) {
  try {
    const student = await getStudentByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ error: "No student record for user" });
    }
    
    const enrollments = await listEnrollmentsByStudent(student.student_ID);
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves all enrollments for a specific section (teacher/admin access)
 * @param {Object} req - Express request object (contains section ID in params)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function listEnrollmentsBySectionHandler(req, res, next) {
  try {
    const enrollments = await listEnrollmentsBySection(req.params.sectionId);
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
}


