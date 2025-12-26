import db from "../config/db.js";

/**
 * User Model - Handles user authentication and profile data
 * Core user management for the Student Information System
 */

/**
 * Finds a user by email address
 * @param {string} email - User email
 * @returns {Object|null} User object or null
 */
export async function findUserByEmail(email) {
  if (!email) {
    return null;
  }

  const [rows] = await db.query(
    `SELECT user_ID, username, password_hash, email, role, first_name, last_name
     FROM users
     WHERE email = ?`,
    [email.toLowerCase()]
  );
  return rows[0] || null;
}

/**
 * Finds a user by ID
 * @param {number} userId - User ID
 * @returns {Object|null} User object or null
 */
export async function findUserById(userId) {
  if (!userId) {
    return null;
  }

  const [rows] = await db.query(
    `SELECT user_ID, username, email, role, first_name, last_name, password_hash
     FROM users
     WHERE user_ID = ?`,
    [userId]
  );
  return rows[0] || null;
}

/**
 * Creates a new user account
 * @param {Object} userData - User information
 * @returns {Object} Created user object
 */
export async function createUser({
  username,
  passwordHash,
  email,
  role = 'student',
  firstName,
  lastName,
}) {
  if (!username || !passwordHash || !email) {
    throw new Error('username, passwordHash, and email are required');
  }

  const validRoles = ['student', 'teacher', 'admin'];
  if (!validRoles.includes(role)) {
    throw new Error('Invalid role. Must be student, teacher, or admin');
  }
  
  const [result] = await db.query(
    `INSERT INTO users (username, password_hash, email, role, first_name, last_name)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [username, passwordHash, email.toLowerCase(), role, firstName, lastName]
  );

  return {
    user_ID: result.insertId,
    username,
    email: email.toLowerCase(),
    role,
    first_name: firstName,
    last_name: lastName,
  };
}

/**
 * Updates a user's password
 * @param {number} userId - User ID
 * @param {string} passwordHash - New password hash
 * @returns {boolean} True if updated, false otherwise
 */
export async function updateUserPassword(userId, passwordHash) {
  if (!userId || !passwordHash) {
    throw new Error('userId and passwordHash are required');
  }

  const [result] = await db.query(
    `UPDATE users SET password_hash = ? WHERE user_ID = ?`,
    [passwordHash, userId]
  );
  return result.affectedRows > 0;
}

/**
 * Retrieves users by role
 * @param {string} role - User role
 * @returns {Array} Array of users with specified role
 */
export async function getUsersByRole(role) {
  const validRoles = ['student', 'teacher', 'admin'];
  if (!validRoles.includes(role)) {
    throw new Error('Invalid role');
  }

  const [rows] = await db.query(
    `SELECT user_ID, username, email, role, first_name, last_name
     FROM users
     WHERE role = ?
     ORDER BY last_name, first_name`,
    [role]
  );
  return rows;
}


