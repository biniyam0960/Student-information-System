import db from "../config/db.js";

/**
 * Assignment Model - Handles assignment data operations
 */

export async function createAssignment({
  section_ID,
  title,
  max_score,
  weight,
}) {
  // Validate required fields
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

export async function getAssignmentById(assignmentId) {
  const [rows] = await db.query(
    `SELECT * FROM assignments WHERE assignment_ID = ?`,
    [assignmentId]
  );
  return rows[0] || null;
}

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

export async function deleteAssignment(assignmentId) {
  const [result] = await db.query(
    `DELETE FROM assignments WHERE assignment_ID = ?`,
    [assignmentId]
  );
  return result.affectedRows > 0;
}


