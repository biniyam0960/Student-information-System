import { db } from "../config/mockDb.js";

// Students table:
// student_ID (PK), user_ID (FK to users), student_ID_number, date_of_birth,
// gender, address, current_status

export async function createStudent({
  userId,
  studentIdNumber,
  dateOfBirth,
  gender,
  address,
  currentStatus,
}) {
  const [result] = await db.query(
    `INSERT INTO students
      (user_ID, student_ID_number, date_of_birth, gender, address, current_status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, studentIdNumber, dateOfBirth, gender, address, currentStatus]
  );

  const [rows] = await db.query(
    `SELECT *
     FROM students
     WHERE student_ID = ?`,
    [result.insertId]
  );

  return rows[0];
}

export async function getAllStudents() {
  const [rows] = await db.query(
    `SELECT s.*, u.username, u.email, u.first_name, u.last_name
     FROM students s
     JOIN users u ON s.user_ID = u.user_ID`
  );
  return rows;
}

export async function getStudentById(studentId) {
  const [rows] = await db.query(
    `SELECT s.*, u.username, u.email, u.first_name, u.last_name
     FROM students s
     JOIN users u ON s.user_ID = u.user_ID
     WHERE s.student_ID = ?`,
    [studentId]
  );
  return rows[0] || null;
}

export async function getStudentByUserId(userId) {
  const [rows] = await db.query(
    `SELECT s.*, u.username, u.email, u.first_name, u.last_name
     FROM students s
     JOIN users u ON s.user_ID = u.user_ID
     WHERE s.user_ID = ?`,
    [userId]
  );
  return rows[0] || null;
}

export async function updateStudent(studentId, fields) {
  const {
    student_ID_number,
    date_of_birth,
    gender,
    address,
    current_status,
  } = fields;

  const [result] = await db.query(
    `UPDATE students
     SET student_ID_number = ?,
         date_of_birth = ?,
         gender = ?,
         address = ?,
         current_status = ?
     WHERE student_ID = ?`,
    [
      student_ID_number,
      date_of_birth,
      gender,
      address,
      current_status,
      studentId,
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getStudentById(studentId);
}

export async function deleteStudent(studentId) {
  const [result] = await db.query(
    `DELETE FROM students
     WHERE student_ID = ?`,
    [studentId]
  );
  return result.affectedRows > 0;
}


