import  db  from "../config/db.js";



export async function createCourse({ title, credits }) {
  const [result] = await db.query(
    `INSERT INTO courses (title, credits) VALUES (?, ?)`,
    [title, credits]
  );
  const [rows] = await db.query(
    `SELECT course_ID, title, credits FROM courses WHERE course_ID = ?`,
    [result.insertId]
  );
  return rows[0];
}

export async function getAllCourses() {
  const [rows] = await db.query(
    `SELECT course_ID, title, credits FROM courses ORDER BY title`
  );
  return rows;
}

export async function getCourseById(courseId) {
  const [rows] = await db.query(
    `SELECT course_ID, title, credits FROM courses WHERE course_ID = ?`,
    [courseId]
  );
  return rows[0] || null;
}

export async function updateCourse(courseId, { title, credits }) {
  await db.query(
    `UPDATE courses SET title = ?, credits = ? WHERE course_ID = ?`,
    [title, credits, courseId]
  );
  return getCourseById(courseId);
}

export async function deleteCourse(courseId) {
  const [result] = await db.query(
    `DELETE FROM courses WHERE course_ID = ?`,
    [courseId]
  );
  return result.affectedRows > 0;
}


