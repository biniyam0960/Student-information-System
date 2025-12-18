// src/config/mockDb.js
// Simple in-memory / no-op mock DB that matches the mysql2/promise pool API shape

export const db = {
  async query(sql, params) {
    console.log("🛠️ Mock DB query:", sql, params);
    // Return [rows, fields] shape like mysql2/promise
    return [[], []];
  },
  async execute(sql, params) {
    console.log("🛠️ Mock DB execute:", sql, params);
    return [[], []];
  },
  async getConnection() {
    console.log("🛠️ Mock DB getConnection");
    return {
      release() {
        console.log("🛠️ Mock DB connection released");
      },
    };
  },
};
