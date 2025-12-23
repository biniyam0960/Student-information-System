import db from "../config/db.js";

/**
 * User Model - Handles user authentication and profile data
 * Core user management for the Student Information System
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

export async function createUser({
  username,
  passwordHash,
  email,
  role = 'student',
  firstName,
  lastName,
}) {
  // Validate required fields
  if (!username || !passwordHash || !email) {
    throw new Error('username, passwordHash, and email are required');
  }

  // Validate role
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


