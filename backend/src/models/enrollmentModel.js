/**
 * Enrollment Model - Database operations for student enrollment management
 * Handles enrollment, waitlisting, and enrollment status tracking
 */

import  db  from "../config/db.js";

/**
 * Creates a new enrollment record
 * @param {Object} enrollmentData - Enrollment information
 * @param {number} enrollmentData.student_ID - ID of the student
 * @param {number} enrollmentData.section_ID - ID of the section
 * @param {string} enrollmentData.status - Enrollment status (enrolled, waitlisted, dropped)
 * @returns {Object} Created enrollment object
 */
export async function createEnrollment({
  student_ID,
  section_ID,
  status,
}) {
  // Insert new enrollment with current timestamp
  const [result] = await db.query(
    `INSERT INTO enrollments (student_ID, section_ID, status, enrolled_at)
     VALUES (?, ?, ?, NOW())`,
    [student_ID, section_ID, status]
  );
  
  // Retrieve and return the created enrollment
  const [rows] = await db.query(
    `SELECT * FROM enrollments WHERE enrollment_ID = ?`,
    [result.insertId]
  );
  return rows[0];
}

/**
 * Retrieves an enrollment record for a specific student and section
 * @param {number} student_ID - ID of the student
 * @param {number} section_ID - ID of the section
 * @returns {Object|null} Enrollment object if found, null otherwise
 */
export async function getEnrollment(student_ID, section_ID) {
  const [rows] = await db.query(
    `SELECT * FROM enrollments WHERE student_ID = ? AND section_ID = ?`,
    [student_ID, section_ID]
  );
  return rows[0] || null;
}

/**
 * Updates the status of an enrollment
 * @param {number} enrollment_ID - ID of the enrollment to update
 * @param {string} status - New enrollment status
 * @returns {Object} Updated enrollment object
 */
export async function updateEnrollmentStatus(enrollment_ID, status) {
  // Update enrollment status
  await db.query(
    `UPDATE enrollments SET status = ? WHERE enrollment_ID = ?`,
    [status, enrollment_ID]
  );
  
  // Return updated enrollment data
  const [rows] = await db.query(
    `SELECT * FROM enrollments WHERE enrollment_ID = ?`,
    [enrollment_ID]
  );
  return rows[0];
}

/**
 * Retrieves all enrollments for a specific student
 * @param {number} student_ID - ID of the student
 * @returns {Array} Array of enrollment objects with section information
 */
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

/**
 * Retrieves all enrollments for a specific section
 * @param {number} section_ID - ID of the section
 * @returns {Array} Array of enrollment objects for the section
 */
export async function listEnrollmentsBySection(section_ID) {
  const [rows] = await db.query(
    `SELECT * FROM enrollments WHERE section_ID = ?`,
    [section_ID]
  );
  return rows;
}


