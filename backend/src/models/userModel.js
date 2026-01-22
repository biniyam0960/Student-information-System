// src/models/userModel.js
import db from "../config/db.js";

// Users table:
// user_ID (PK), username, password_hash, email, role, first_name, last_name

// Used ONLY for login
export async function findUserByEmail(email) {
  const [rows] = await db.query(
    `SELECT user_ID, username, password_hash, email, role, first_name, last_name
     FROM users
     WHERE email = ?`,
    [email]
  );

  console.log("findUserByEmail result:", rows);
  return rows[0] || null;
}

// Used for /me and profile endpoints (NO password)
export async function findUserById(userId) {
  const [rows] = await db.query(
    `SELECT user_ID, username, email, role, first_name, last_name
     FROM users
     WHERE user_ID = ?`,
    [userId]
  );

  console.log("findUserById result:", rows);
  return rows[0] || null;
}

// Used during registration
export async function createUser({
  username,
  password_hash,
  email,
  role,
  first_name,
  last_name,
}) {
  const [result] = await db.query(
    `INSERT INTO users (username, password_hash, email, role, first_name, last_name)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [username, password_hash, email, role, first_name, last_name]
  );

  const user_ID = result?.insertId ?? Math.floor(Math.random() * 10000);

  const user = {
    user_ID,
    username,
    email,
    role,
    first_name,
    last_name,
    password_hash, // needed internally
  };

  console.log("User created in DB:", user);
  return user;
}
