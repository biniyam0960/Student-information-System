import db from "../config/db.js";

/**
 * Assignment Model - Handles assignment data operations
 */

/**
 * Creates a new assignment
 * @param {Object} assignmentData - Assignment information
 * @returns {Object} Created assignment object
 */
export async function createAssignment({
  section_ID,
  title,
  max_score,
  weight,
}) {
  if (!section_ID || !title || max_score == null) {
    throw new Error('section_ID, title, and max_score are required');
  }

  const [result] = await db.query(
    `INSERT INTO assignments (section_ID, title, max_score, weight)
     VALUES (?, ?, ?, ?)`,
    [section_ID, title, max_score, weight || 1.0]
  );

  return getAssignmentById(result.insertId);
}

/**
 * Retrieves an assignment by ID
 * @param {number} assignmentId - Assignment ID
 * @returns {Object|null} Assignment object or null
 */
export async function getAssignmentById(assignmentId) {
  const [rows] = await db.query(
    `SELECT * FROM assignments WHERE assignment_ID = ?`,
    [assignmentId]
  );
  return rows[0] || null;
}

/**
 * Lists all assignments for a section
 * @param {number} sectionId - Section ID
 * @returns {Array} Array of assignment objects
 */
export async function listAssignmentsBySection(sectionId) {
  if (!sectionId) {
    throw new Error('sectionId is required');
  }

  const [rows] = await db.query(
    `SELECT * FROM assignments WHERE section_ID = ? ORDER BY title`,
    [sectionId]
  );
  return rows;
}

/**
 * Updates an assignment
 * @param {number} assignmentId - Assignment ID
 * @param {Object} fields - Fields to update
 * @returns {Object|null} Updated assignment or null
 */
export async function updateAssignment(assignmentId, fields) {
  const { title, max_score, weight } = fields;
  
  const [result] = await db.query(
    `UPDATE assignments 
     SET title = COALESCE(?, title),
         max_score = COALESCE(?, max_score),
         weight = COALESCE(?, weight)
     WHERE assignment_ID = ?`,
    [title, max_score, weight, assignmentId]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getAssignmentById(assignmentId);
}

/**
 * Deletes an assignment
 * @param {number} assignmentId - Assignment ID
 * @returns {boolean} True if deleted, false otherwise
 */
export async function deleteAssignment(assignmentId) {
  const [result] = await db.query(
    `DELETE FROM assignments WHERE assignment_ID = ?`,
    [assignmentId]
  );
  return result.affectedRows > 0;
}


