import db from "../config/db.js";

/**
 * Student Model - Handles student data operations
 * Maintains relationship between users and student profiles
 */

/**
 * Creates a new student record
 * @param {Object} studentData - Student information
 * @returns {Object} Created student object
 */
export async function createStudent({
  userId,
  studentIdNumber,
  dateOfBirth,
  gender,
  address,
  currentStatus = 'active',
}) {
  if (!userId || !studentIdNumber) {
    throw new Error('userId and studentIdNumber are required');
  }
  
  const [result] = await db.query(
    `INSERT INTO students
      (user_ID, student_ID_number, date_of_birth, gender, address, current_status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, studentIdNumber, dateOfBirth, gender, address, currentStatus]
  );

  return getStudentById(result.insertId);
}

/**
 * Retrieves all students with user information
 * @returns {Array} Array of student objects with user details
 */
export async function getAllStudents() {
  const [rows] = await db.query(
    `SELECT s.*, u.username, u.email, u.first_name, u.last_name, u.role
     FROM students s
     JOIN users u ON s.user_ID = u.user_ID
     ORDER BY u.last_name, u.first_name`
  );
  return rows;
}

/**
 * Retrieves a student by ID
 * @param {number} studentId - Student ID
 * @returns {Object|null} Student object or null
 */
export async function getStudentById(studentId) {
  if (!studentId) {
    return null;
  }

  const [rows] = await db.query(
    `SELECT s.*, u.username, u.email, u.first_name, u.last_name, u.role
     FROM students s
     JOIN users u ON s.user_ID = u.user_ID
     WHERE s.student_ID = ?`,
    [studentId]
  );
  return rows[0] || null;
}

/**
 * Retrieves a student by user ID
 * @param {number} userId - User ID
 * @returns {Object|null} Student object or null
 */
export async function getStudentByUserId(userId) {
  if (!userId) {
    return null;
  }

  const [rows] = await db.query(
    `SELECT s.*, u.username, u.email, u.first_name, u.last_name, u.role
     FROM students s
     JOIN users u ON s.user_ID = u.user_ID
     WHERE s.user_ID = ?`,
    [userId]
  );
  return rows[0] || null;
}

/**
 * Updates a student record
 * @param {number} studentId - Student ID
 * @param {Object} fields - Fields to update
 * @returns {Object|null} Updated student or null
 */
export async function updateStudent(studentId, fields) {
  if (!studentId) {
    throw new Error('studentId is required');
  }

  const {
    student_ID_number,
    date_of_birth,
    gender,
    address,
    current_status,
  } = fields;

  const [result] = await db.query(
    `UPDATE students
     SET student_ID_number = COALESCE(?, student_ID_number),
         date_of_birth = COALESCE(?, date_of_birth),
         gender = COALESCE(?, gender),
         address = COALESCE(?, address),
         current_status = COALESCE(?, current_status)
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

/**
 * Deletes a student record
 * @param {number} studentId - Student ID
 * @returns {boolean} True if deleted, false otherwise
 */
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

/**
 * Retrieves students by status
 * @param {string} status - Student status
 * @returns {Array} Array of students with specified status
 */
export async function getStudentsByStatus(status = 'active') {
  const [rows] = await db.query(
    `SELECT s.*, u.username, u.email, u.first_name, u.last_name
     FROM students s
     JOIN users u ON s.user_ID = u.user_ID
     WHERE s.current_status = ?
     ORDER BY u.last_name, u.first_name`,
    [status]
  );
  return rows;
}


