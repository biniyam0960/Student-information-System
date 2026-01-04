import db from "../config/db.js";


export async function createStudent({
  userId,
  studentIdNumber,
  dateOfBirth,
  gender,
  address,
  currentStatus = "active",
  departmentId,
}) {
  if (!userId || !studentIdNumber) {
    throw new Error("userId and studentIdNumber are required");
  }

  const [result] = await db.query(
    `INSERT INTO students
      (user_ID, student_ID_number, date_of_birth, gender, address, current_status, department_ID)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, studentIdNumber, dateOfBirth, gender, address, currentStatus, departmentId || null]
  );

  return getStudentById(result.insertId);
}


export async function getAllStudents() {
  const [rows] = await db.query(
    `SELECT
        s.*,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.role,
        d.code AS department_code,
        d.name AS department_name
     FROM students s
     JOIN users u ON s.user_ID = u.user_ID
     LEFT JOIN departments d ON s.department_ID = d.department_ID
     ORDER BY u.last_name, u.first_name`
  );
  return rows;
}


export async function getStudentById(studentId) {
  if (!studentId) {
    return null;
  }

  const [rows] = await db.query(
    `SELECT 
        s.*,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.role,
        d.code AS department_code,
        d.name AS department_name
     FROM students s
     JOIN users u ON s.user_ID = u.user_ID
     LEFT JOIN departments d ON s.department_ID = d.department_ID
     WHERE s.student_ID = ?`,
    [studentId]
  );
  return rows[0] || null;
}


export async function getStudentByUserId(userId) {
  if (!userId) {
    return null;
  }

  const [rows] = await db.query(
    `SELECT 
        s.*,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        u.role,
        d.code AS department_code,
        d.name AS department_name
     FROM students s
     JOIN users u ON s.user_ID = u.user_ID
     LEFT JOIN departments d ON s.department_ID = d.department_ID
     WHERE s.user_ID = ?`,
    [userId]
  );
  return rows[0] || null;
}


export async function updateStudent(studentId, fields) {
  if (!studentId) {
    throw new Error("studentId is required");
  }

  const {
    student_ID_number,
    date_of_birth,
    gender,
    address,
    current_status,
    department_ID,
  } = fields;

  const [result] = await db.query(
    `UPDATE students
     SET student_ID_number = COALESCE(?, student_ID_number),
         date_of_birth     = COALESCE(?, date_of_birth),
         gender            = COALESCE(?, gender),
         address           = COALESCE(?, address),
         current_status    = COALESCE(?, current_status),
         department_ID     = COALESCE(?, department_ID)
     WHERE student_ID = ?`,
    [
      student_ID_number,
      date_of_birth,
      gender,
      address,
      current_status,
      department_ID,
      studentId,
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getStudentById(studentId);
}


export async function deleteStudent(studentId) {
  if (!studentId) {
    return false;
  }

  const [result] = await db.query(
    `DELETE FROM students WHERE student_ID = ?`,
    [studentId]
  );
  return result.affectedRows > 0;
}


export async function getStudentsByStatus(status = "active") {
  const [rows] = await db.query(
    `SELECT
        s.*,
        u.username,
        u.email,
        u.first_name,
        u.last_name,
        d.code AS department_code,
        d.name AS department_name
     FROM students s
     JOIN users u ON s.user_ID = u.user_ID
     LEFT JOIN departments d ON s.department_ID = d.department_ID
     WHERE s.current_status = ?
     ORDER BY u.last_name, u.first_name`,
    [status]
  );
  return rows;
}
