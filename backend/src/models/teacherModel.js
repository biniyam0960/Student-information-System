import db from "../config/db.js";


export async function createTeacher({
  user_ID,
  employee_number,
  department,
  hire_date,
  phone,
}) {
  if (!user_ID || !employee_number) {
    throw new Error("user_ID and employee_number are required");
  }

  const [result] = await db.query(
    `INSERT INTO teachers (user_ID, employee_number, department, hire_date, phone)
     VALUES (?, ?, ?, ?, ?)`,
    [user_ID, employee_number, department || null, hire_date || null, phone || null]
  );

  return getTeacherById(result.insertId);
}


export async function getTeacherById(teacher_ID) {
  if (!teacher_ID) return null;

  const [rows] = await db.query(
    `SELECT t.*, u.username, u.email, u.first_name, u.last_name, u.role
     FROM teachers t
     JOIN users u ON t.user_ID = u.user_ID
     WHERE t.teacher_ID = ?`,
    [teacher_ID]
  );

  return rows[0] || null;
}


export async function getTeacherByUserId(user_ID) {
  if (!user_ID) return null;

  const [rows] = await db.query(
    `SELECT t.*, u.username, u.email, u.first_name, u.last_name, u.role
     FROM teachers t
     JOIN users u ON t.user_ID = u.user_ID
     WHERE t.user_ID = ?`,
    [user_ID]
  );

  return rows[0] || null;
}


export async function getAllTeachers() {
  const [rows] = await db.query(
    `SELECT t.*, u.username, u.email, u.first_name, u.last_name, u.role
     FROM teachers t
     JOIN users u ON t.user_ID = u.user_ID
     ORDER BY u.last_name, u.first_name`
  );
  return rows;
}

export async function updateTeacher(teacher_ID, fields) {
  if (!teacher_ID) {
    throw new Error("teacher_ID is required");
  }

  const { employee_number, department, hire_date, phone } = fields;

  const [result] = await db.query(
    `UPDATE teachers
     SET employee_number = COALESCE(?, employee_number),
         department      = COALESCE(?, department),
         hire_date       = COALESCE(?, hire_date),
         phone           = COALESCE(?, phone)
     WHERE teacher_ID = ?`,
    [employee_number, department, hire_date, phone, teacher_ID]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getTeacherById(teacher_ID);
}


export async function deleteTeacher(teacher_ID) {
  if (!teacher_ID) return false;

  const [result] = await db.query(
    `DELETE FROM teachers WHERE teacher_ID = ?`,
    [teacher_ID]
  );

  return result.affectedRows > 0;
}
