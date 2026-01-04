import db from "../config/db.js";


export async function createDepartment({ code, name }) {
  if (!code || !name) {
    throw new Error("code and name are required");
  }

  const [result] = await db.query(
    `INSERT INTO departments (code, name)
     VALUES (?, ?)`,
    [code, name]
  );

  return getDepartmentById(result.insertId);
}


export async function getDepartmentById(department_ID) {
  if (!department_ID) return null;

  const [rows] = await db.query(
    `SELECT department_ID, code, name
     FROM departments
     WHERE department_ID = ?`,
    [department_ID]
  );

  return rows[0] || null;
}


export async function getDepartmentByCode(code) {
  if (!code) return null;

  const [rows] = await db.query(
    `SELECT department_ID, code, name
     FROM departments
     WHERE code = ?`,
    [code]
  );

  return rows[0] || null;
}


export async function getAllDepartments() {
  const [rows] = await db.query(
    `SELECT department_ID, code, name
     FROM departments
     ORDER BY name`
  );
  return rows;
}


export async function updateDepartment(department_ID, fields) {
  if (!department_ID) {
    throw new Error("department_ID is required");
  }

  const { code, name } = fields;

  const [result] = await db.query(
    `UPDATE departments
     SET code = COALESCE(?, code),
         name = COALESCE(?, name)
     WHERE department_ID = ?`,
    [code, name, department_ID]
  );

  if (result.affectedRows === 0) return null;

  return getDepartmentById(department_ID);
}


export async function deleteDepartment(department_ID) {
  if (!department_ID) return false;

  const [result] = await db.query(
    `DELETE FROM departments WHERE department_ID = ?`,
    [department_ID]
  );

  return result.affectedRows > 0;
}
