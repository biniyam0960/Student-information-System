/**
 * Attendance Model - Database operations for attendance tracking
 * Handles attendance recording and retrieval for students in sections
 */

import  db  from "../config/db.js";

/**
 * Records or updates attendance for a student in a section on a specific date
 * @param {Object} attendanceData - Attendance information
 * @param {number} attendanceData.section_ID - ID of the section
 * @param {number} attendanceData.student_ID - ID of the student
 * @param {Date} attendanceData.date - Date of attendance
 * @param {string} attendanceData.status - Attendance status (present, absent, late)
 * @returns {Object} Created or updated attendance record
 */
export async function markAttendance({
  section_ID,
  student_ID,
  date,
  status,
}) {
  // Insert new attendance or update existing one if duplicate key
  await db.query(
    `INSERT INTO attendance (section_ID, student_ID, date, status)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE status = VALUES(status)`,
    [section_ID, student_ID, date, status]
  );
  
  // Retrieve and return the attendance record
  const [rows] = await db.query(
    `SELECT * FROM attendance WHERE section_ID = ? AND student_ID = ? AND date = ?`,
    [section_ID, student_ID, date]
  );
  return rows[0];
}

/**
 * Retrieves all attendance records for a section on a specific date
 * @param {number} section_ID - ID of the section
 * @param {Date} date - Date to retrieve attendance for
 * @returns {Array} Array of attendance records for the section and date
 */
export async function listAttendanceForSectionOnDate(section_ID, date) {
  const [rows] = await db.query(
    `SELECT * FROM attendance WHERE section_ID = ? AND date = ?`,
    [section_ID, date]
  );
  return rows;
}

/**
 * Retrieves all attendance records for a specific student
 * @param {number} student_ID - ID of the student
 * @returns {Array} Array of all attendance records for the student
 */
export async function listAttendanceForStudent(student_ID) {
  const [rows] = await db.query(
    `SELECT * FROM attendance WHERE student_ID = ?`,
    [student_ID]
  );
  return rows;
}


