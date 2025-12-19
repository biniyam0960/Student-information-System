import  db  from "../config/db.js";

// Users table:
// user_ID (PK), username, password_hash, email, role, first_name, last_name

export async function findUserByEmail(email) {
  const [rows] = await db.query(
    `SELECT user_ID, username, password_hash, email, role, first_name, last_name
     FROM users
     WHERE email = ?`,
    [email]
  );
  return rows[0] || null;
}

export async function findUserById(userId) {
  const [rows] = await db.query(
    `SELECT user_ID, username, email, role, first_name, last_name
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
  role,
  firstName,
  lastName,
}) {
  const [result] = await db.query(
    `INSERT INTO users (username, password_hash, email, role, first_name, last_name)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [username, passwordHash, email, role, firstName, lastName]
  );

  return {
    user_ID: result.insertId,
    username,
    email,
    role,
    first_name: firstName,
    last_name: lastName,
  };
}


