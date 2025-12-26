/**
 * Section Controller - HTTP request handlers for section management
 * Handles API endpoints for course section operations with role-based access
 */

import { body } from "express-validator";
import {
  createSection,
  getAllSections,
  getSectionsByTeacher,
  getSectionById,
  updateSection,
  deleteSection,
} from "../models/sectionModel.js";

/**
 * Validation rules for section creation
 */
export const createSectionValidators = [
  body("course_ID").isInt({ gt: 0 }),
  body("capacity").isInt({ gt: 0 }),
  body("schedule_details").isString().notEmpty().trim(),
  body("teacher_user_ID").isInt({ gt: 0 }),
];

/**
 * Validation rules for section updates (all fields optional)
 */
export const updateSectionValidators = [
  body("course_ID").optional().isInt({ gt: 0 }),
  body("capacity").optional().isInt({ gt: 0 }),
  body("schedule_details").optional().isString().notEmpty().trim(),
  body("teacher_user_ID").optional().isInt({ gt: 0 }),
];

/**
 * Creates a new course section
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function createSectionHandler(req, res, next) {
  try {
    const section = await createSection(req.body);
    res.status(201).json(section);
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves sections based on user role
 * Teachers see only their assigned sections, others see all sections
 * @param {Object} req - Express request object (contains user info)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function listSectionsHandler(req, res, next) {
  try {
    if (req.user.role === "teacher") {
      const sections = await getSectionsByTeacher(req.user.userId);
      return res.json(sections);
    }
    
    const sections = await getAllSections();
    res.json(sections);
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a specific section by ID
 * @param {Object} req - Express request object (contains section ID in params)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function getSectionHandler(req, res, next) {
  try {
    const section = await getSectionById(req.params.id);
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }
    res.json(section);
  } catch (err) {
    next(err);
  }
}

/**
 * Updates an existing section
 * @param {Object} req - Express request object (contains section ID and update data)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function updateSectionHandler(req, res, next) {
  try {
    const existing = await getSectionById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Section not found" });
    }
    
    const updated = await updateSection(req.params.id, {
      course_ID: req.body.course_ID ?? existing.course_ID,
      capacity: req.body.capacity ?? existing.capacity,
      schedule_details:
        req.body.schedule_details ?? existing.schedule_details,
      teacher_user_ID:
        req.body.teacher_user_ID ?? existing.teacher_user_ID,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Deletes a section
 * @param {Object} req - Express request object (contains section ID in params)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function deleteSectionHandler(req, res, next) {
  try {
    const ok = await deleteSection(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: "Section not found" });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}


