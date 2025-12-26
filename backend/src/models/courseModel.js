/**
 * Course Model - Database operations for course management
 * Handles CRUD operations for courses in the Student Information System
 */

import  db  from "../config/db.js";

/**
 * Creates a new course in the database
 * @param {Object} courseData - Course information
 * @param {string} courseData.title - Course title/name
 * @param {number} courseData.credits - Number of credit hours
 * @returns {Object} Created course object with ID
 */
export async function createCourse({ title, credits }) {
  // Insert new course into database
  const [result] = await db.query(
    `INSERT INTO courses (title, credits) VALUES (?, ?)`,
    [title, credits]
  );
  
  // Retrieve and return the created course
  const [rows] = await db.query(
    `SELECT course_ID, title, credits FROM courses WHERE course_ID = ?`,
    [result.insertId]
  );
  return rows[0];
}

/**
 * Retrieves all courses from the database
 * @returns {Array} Array of all course objects sorted by title
 */
export async function getAllCourses() {
  const [rows] = await db.query(
    `SELECT course_ID, title, credits FROM courses ORDER BY title`
  );
  return rows;
}

/**
 * Retrieves a specific course by its ID
 * @param {number} courseId - The course ID to search for
 * @returns {Object|null} Course object if found, null otherwise
 */
export async function getCourseById(courseId) {
  const [rows] = await db.query(
    `SELECT course_ID, title, credits FROM courses WHERE course_ID = ?`,
    [courseId]
  );
  return rows[0] || null;
}

/**
 * Updates an existing course's information
 * @param {number} courseId - ID of the course to update
 * @param {Object} updateData - Updated course information
 * @param {string} updateData.title - New course title
 * @param {number} updateData.credits - New credit hours
 * @returns {Object} Updated course object
 */
export async function updateCourse(courseId, { title, credits }) {
  // Update course in database
  await db.query(
    `UPDATE courses SET title = ?, credits = ? WHERE course_ID = ?`,
    [title, credits, courseId]
  );
  
  // Return updated course data
  return getCourseById(courseId);
}

/**
 * Deletes a course from the database
 * @param {number} courseId - ID of the course to delete
 * @returns {boolean} True if course was deleted, false otherwise
 */
export async function deleteCourse(courseId) {
  const [result] = await db.query(
    `DELETE FROM courses WHERE course_ID = ?`,
    [courseId]
  );
  return result.affectedRows > 0;
}


