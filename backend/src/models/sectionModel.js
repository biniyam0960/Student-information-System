/**
 * Section Model - Database operations for course section management
 * Handles CRUD operations for course sections and enrollment tracking
 */

import  db  from "../config/db.js";

/**
 * Creates a new course section
 * @param {Object} sectionData - Section information
 * @param {number} sectionData.course_ID - ID of the associated course
 * @param {number} sectionData.capacity - Maximum number of students
 * @param {string} sectionData.schedule_details - Schedule information
 * @param {number} sectionData.teacher_user_ID - ID of the assigned teacher
 * @returns {Object} Created section object
 */
export async function createSection({
  course_ID,
  capacity,
  schedule_details,
  teacher_user_ID,
}) {
  // Insert new section into database
  const [result] = await db.query(
    `INSERT INTO sections (course_ID, capacity, schedule_details, teacher_user_ID)
     VALUES (?, ?, ?, ?)`,
    [course_ID, capacity, schedule_details, teacher_user_ID]
  );
  
  // Retrieve and return the created section
  const [rows] = await db.query(
    `SELECT * FROM sections WHERE section_ID = ?`,
    [result.insertId]
  );
  return rows[0];
}

/**
 * Retrieves a specific section by its ID
 * @param {number} sectionId - The section ID to search for
 * @returns {Object|null} Section object if found, null otherwise
 */
export async function getSectionById(sectionId) {
  const [rows] = await db.query(
    `SELECT * FROM sections WHERE section_ID = ?`,
    [sectionId]
  );
  return rows[0] || null;
}

/**
 * Retrieves all sections with associated course information
 * @returns {Array} Array of section objects with course details
 */
export async function getAllSections() {
  const [rows] = await db.query(
    `SELECT s.*, c.title, c.credits
     FROM sections s
     JOIN courses c ON s.course_ID = c.course_ID`
  );
  return rows;
}

/**
 * Retrieves all sections taught by a specific teacher
 * @param {number} teacherUserId - User ID of the teacher
 * @returns {Array} Array of sections assigned to the teacher
 */
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

/**
 * Updates an existing section's information
 * @param {number} sectionId - ID of the section to update
 * @param {Object} fields - Updated section information
 * @returns {Object} Updated section object
 */
export async function updateSection(sectionId, fields) {
  const { course_ID, capacity, schedule_details, teacher_user_ID } = fields;
  
  // Update section in database
  await db.query(
    `UPDATE sections
     SET course_ID = ?, capacity = ?, schedule_details = ?, teacher_user_ID = ?
     WHERE section_ID = ?`,
    [course_ID, capacity, schedule_details, teacher_user_ID, sectionId]
  );
  
  // Return updated section data
  return getSectionById(sectionId);
}

/**
 * Deletes a section from the database
 * @param {number} sectionId - ID of the section to delete
 * @returns {boolean} True if section was deleted, false otherwise
 */
export async function deleteSection(sectionId) {
  const [result] = await db.query(
    `DELETE FROM sections WHERE section_ID = ?`,
    [sectionId]
  );
  return result.affectedRows > 0;
}

/**
 * Counts the number of enrolled students in a section
 * @param {number} sectionId - ID of the section
 * @returns {number} Number of enrolled students
 */
export async function countEnrolledInSection(sectionId) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count
     FROM enrollments
     WHERE section_ID = ? AND status = 'enrolled'`,
    [sectionId]
  );
  return rows[0]?.count || 0;
}


