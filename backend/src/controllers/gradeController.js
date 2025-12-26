/**
 * Grade Controller - HTTP request handlers for grade and assignment management
 * Handles assignment creation, grade recording, and GPA calculation
 */

import { body } from "express-validator";
import { getStudentByUserId } from "../models/studentModel.js";
import { createAssignment, listAssignmentsBySection } from "../models/assignmentModel.js";
import { upsertGrade, listGradesByStudent, listGradesByStudentInSection } from "../models/gradeModel.js";
import { calculateFinalGradeForSection, letterGradeFromPercent } from "../services/gpaService.js";

/**
 * Validation rules for assignment creation
 */
export const createAssignmentValidators = [
  body("section_ID").isInt({ gt: 0 }),
  body("title").isString().notEmpty().trim(),
  body("max_score").isFloat({ gt: 0 }),
  body("weight").isFloat({ gt: 0 }),
];

/**
 * Validation rules for grade entry
 */
export const gradeValidators = [
  body("assignment_ID").isInt({ gt: 0 }),
  body("student_ID").isInt({ gt: 0 }),
  body("score").isFloat({ min: 0 }),
];

/**
 * Creates a new assignment for a section
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function createAssignmentHandler(req, res, next) {
  try {
    const assignment = await createAssignment(req.body);
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves all assignments for a specific section
 * @param {Object} req - Express request object (contains section ID in params)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function listAssignmentsForSectionHandler(req, res, next) {
  try {
    const assignments = await listAssignmentsBySection(req.params.sectionId);
    res.json(assignments);
  } catch (err) {
    next(err);
  }
}

/**
 * Creates or updates a grade for a student assignment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function upsertGradeHandler(req, res, next) {
  try {
    const grade = await upsertGrade(req.body);
    res.status(201).json(grade);
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves grades for the authenticated student in a specific section
 * @param {Object} req - Express request object (contains section ID and authenticated user)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function mySectionGradesHandler(req, res, next) {
  try {
    const student = await getStudentByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ error: "No student record for user" });
    }
    
    const grades = await listGradesByStudentInSection(
      student.student_ID,
      req.params.sectionId
    );
    res.json(grades);
  } catch (err) {
    next(err);
  }
}

/**
 * Calculates and returns GPA for the authenticated student
 * @param {Object} req - Express request object (contains authenticated user)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function myGpaHandler(req, res, next) {
  try {
    const student = await getStudentByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ error: "No student record for user" });
    }
    
    const grades = await listGradesByStudent(student.student_ID);

    const bySection = new Map();
    for (const g of grades) {
      if (!bySection.has(g.section_ID)) bySection.set(g.section_ID, []);
      bySection.get(g.section_ID).push(g);
    }

    const finals = [];
    for (const [sectionId, arr] of bySection.entries()) {
      const pct = calculateFinalGradeForSection(arr);
      const letter = letterGradeFromPercent(pct);
      finals.push({ section_ID: sectionId, percent: pct, letter });
    }

    let gpa = null;
    if (finals.length > 0) {
      let sum = 0;
      let count = 0;
      for (const f of finals) {
        const letter = f.letter;
        if (!letter) continue;
        
        let points = 0;
        if (letter === "A") points = 4;
        else if (letter === "B") points = 3;
        else if (letter === "C") points = 2;
        else if (letter === "D") points = 1;
        else points = 0;
        
        sum += points;
        count++;
      }
      gpa = count > 0 ? sum / count : null;
    }

    res.json({
      student_ID: student.student_ID,
      finals,
      gpa,
    });
  } catch (err) {
    next(err);
  }
}


