import  db  from "../config/db.js";

// Assignments: assignment_ID, section_ID, title, max_score, weight

export async function createAssignment({
  section_ID,
  title,
  max_score,
  weight,
}) {
  const [result] = await db.query(
    `INSERT INTO assignments (section_ID, title, max_score, weight)
     VALUES (?, ?, ?, ?)`,
    [section_ID, title, max_score, weight]
  );
  const [rows] = await db.query(
    `SELECT * FROM assignments WHERE assignment_ID = ?`,
    [result.insertId]
  );
  return rows[0];
}

export async function listAssignmentsBySection(section_ID) {
  const [rows] = await db.query(
    `SELECT * FROM assignments WHERE section_ID = ?`,
    [section_ID]
  );
  return rows;
}


