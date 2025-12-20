import  db  from "../config/db.js";



export async function createSection({
  course_ID,
  capacity,
  schedule_details,
  teacher_user_ID,
}) {
  const [result] = await db.query(
    `INSERT INTO sections (course_ID, capacity, schedule_details, teacher_user_ID)
     VALUES (?, ?, ?, ?)`,
    [course_ID, capacity, schedule_details, teacher_user_ID]
  );
  const [rows] = await db.query(
    `SELECT * FROM sections WHERE section_ID = ?`,
    [result.insertId]
  );
  return rows[0];
}

export async function getSectionById(sectionId) {
  const [rows] = await db.query(
    `SELECT * FROM sections WHERE section_ID = ?`,
    [sectionId]
  );
  return rows[0] || null;
}

export async function getAllSections() {
  const [rows] = await db.query(
    `SELECT s.*, c.title, c.credits
     FROM sections s
     JOIN courses c ON s.course_ID = c.course_ID`
  );
  return rows;
}

export async function getSectionsByTeacher(teacherUserId) {
  const [rows] = await db.query(
    `SELECT s.*, c.title, c.credits
     FROM sections s
     JOIN courses c ON s.course_ID = c.course_ID
     WHERE s.teacher_user_ID = ?`,
    [teacherUserId]
  );
  return rows;
}

export async function updateSection(sectionId, fields) {
  const { course_ID, capacity, schedule_details, teacher_user_ID } = fields;
  await db.query(
    `UPDATE sections
     SET course_ID = ?, capacity = ?, schedule_details = ?, teacher_user_ID = ?
     WHERE section_ID = ?`,
    [course_ID, capacity, schedule_details, teacher_user_ID, sectionId]
  );
  return getSectionById(sectionId);
}

export async function deleteSection(sectionId) {
  const [result] = await db.query(
    `DELETE FROM sections WHERE section_ID = ?`,
    [sectionId]
  );
  return result.affectedRows > 0;
}

export async function countEnrolledInSection(sectionId) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count
     FROM enrollments
     WHERE section_ID = ? AND status = 'enrolled'`,
    [sectionId]
  );
  return rows[0]?.count || 0;
}


