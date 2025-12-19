import  db  from "../config/db.js";

// Enrollments: enrollment_ID, student_ID, section_ID, status (enrolled|waitlisted|dropped), enrolled_at

export async function createEnrollment({
  student_ID,
  section_ID,
  status,
}) {
  const [result] = await db.query(
    `INSERT INTO enrollments (student_ID, section_ID, status, enrolled_at)
     VALUES (?, ?, ?, NOW())`,
    [student_ID, section_ID, status]
  );
  const [rows] = await db.query(
    `SELECT * FROM enrollments WHERE enrollment_ID = ?`,
    [result.insertId]
  );
  return rows[0];
}

export async function getEnrollment(student_ID, section_ID) {
  const [rows] = await db.query(
    `SELECT * FROM enrollments WHERE student_ID = ? AND section_ID = ?`,
    [student_ID, section_ID]
  );
  return rows[0] || null;
}

export async function updateEnrollmentStatus(enrollment_ID, status) {
  await db.query(
    `UPDATE enrollments SET status = ? WHERE enrollment_ID = ?`,
    [status, enrollment_ID]
  );
  const [rows] = await db.query(
    `SELECT * FROM enrollments WHERE enrollment_ID = ?`,
    [enrollment_ID]
  );
  return rows[0];
}

export async function listEnrollmentsByStudent(student_ID) {
  const [rows] = await db.query(
    `SELECT e.*, s.section_ID, s.course_ID
     FROM enrollments e
     JOIN sections s ON e.section_ID = s.section_ID
     WHERE e.student_ID = ?`,
    [student_ID]
  );
  return rows;
}

export async function listEnrollmentsBySection(section_ID) {
  const [rows] = await db.query(
    `SELECT * FROM enrollments WHERE section_ID = ?`,
    [section_ID]
  );
  return rows;
}


