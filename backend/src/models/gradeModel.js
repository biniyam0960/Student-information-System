import  db  from "../config/db.js";

// Grades: grade_ID, assignment_ID, student_ID, score

export async function upsertGrade({ assignment_ID, student_ID, score }) {
  await db.query(
    `INSERT INTO grades (assignment_ID, student_ID, score)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE score = VALUES(score)`,
    [assignment_ID, student_ID, score]
  );
  const [rows] = await db.query(
    `SELECT * FROM grades WHERE assignment_ID = ? AND student_ID = ?`,
    [assignment_ID, student_ID]
  );
  return rows[0];
}

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


