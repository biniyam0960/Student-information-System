// src/config/mockDb.js

// In-memory "database"
export const users = [];

export const db = {
  query: async (sql, params) => {
    // SELECT by email
    if (sql.startsWith("SELECT") && sql.includes("WHERE email")) {
      const user = users.find(u => u.email === params[0]);
      return [[user || null]];
    }

    // SELECT by user_ID
    if (sql.startsWith("SELECT") && sql.includes("WHERE user_ID")) {
      const user = users.find(u => u.user_ID === params[0]);
      return [[user || null]];
    }

    // INSERT new user
    if (sql.startsWith("INSERT")) {
      const [username, password_hash, email, role, first_name, last_name] = params;
      const user_ID = users.length + 1; // auto increment
      const user = { user_ID, username, password_hash, email, role, first_name, last_name };
      users.push(user);
      return [{ insertId: user_ID }];
    }

    return [[]];
  },
};
