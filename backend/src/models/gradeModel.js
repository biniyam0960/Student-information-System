/**
 * Grade Model - Database operations for grade and assignment management
 * Handles grade recording and retrieval for student assessments
 */

import  db  from "../config/db.js";

/**
 * Creates or updates a grade record (upsert operation)
 * @param {Object} gradeData - Grade information
 * @param {number} gradeData.assignment_ID - ID of the assignment
 * @param {number} gradeData.student_ID - ID of the student
 * @param {number} gradeData.score - Score achieved by the student
 * @returns {Object} Created or updated grade object
 */
export async function upsertGrade({ assignment_ID, student_ID, score }) {
  // Insert new grade or update existing one if duplicate key
  await db.query(
    `INSERT INTO grades (assignment_ID, student_ID, score)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE score = VALUES(score)`,
    [assignment_ID, student_ID, score]
  );
  
  // Retrieve and return the grade record
  const [rows] = await db.query(
    `SELECT * FROM grades WHERE assignment_ID = ? AND student_ID = ?`,
    [assignment_ID, student_ID]
  );
  return rows[0];
}

/**
 * Retrieves all grades for a student in a specific section
 * @param {number} student_ID - ID of the student
 * @param {number} section_ID - ID of the section
 * @returns {Array} Array of grade objects with assignment details
 */
export async function listGradesByStudentInSection(student_ID, section_ID) {
  const [rows] = await db.query(
    `SELECT g.*, a.max_score, a.weight
     FROM grades g
     JOIN assignments a ON g.assignment_ID = a.assignment_ID
     WHERE g.student_ID = ? AND a.section_ID = ?`,
    [student_ID, section_ID]
  );
  return rows;
}

/**
 * Retrieves all grades for a student across all sections
 * @param {number} student_ID - ID of the student
 * @returns {Array} Array of grade objects with assignment and section details
 */
export async function listGradesByStudent(student_ID) {
  const [rows] = await db.query(
    `SELECT g.*, a.section_ID, a.max_score, a.weight
     FROM grades g
     JOIN assignments a ON g.assignment_ID = a.assignment_ID
     WHERE g.student_ID = ?`,
    [student_ID]
  );
  return rows;
}


