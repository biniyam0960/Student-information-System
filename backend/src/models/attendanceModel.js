import  db  from "../config/db.js";

// Attendance: attendance_ID, section_ID, student_ID, date, status (present|absent|late)

export async function markAttendance({
  section_ID,
  student_ID,
  date,
  status,
}) {
  await db.query(
    `INSERT INTO attendance (section_ID, student_ID, date, status)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE status = VALUES(status)`,
    [section_ID, student_ID, date, status]
  );
  const [rows] = await db.query(
    `SELECT * FROM attendance WHERE section_ID = ? AND student_ID = ? AND date = ?`,
    [section_ID, student_ID, date]
  );
  return rows[0];
}

export async function listAttendanceForSectionOnDate(section_ID, date) {
  const [rows] = await db.query(
    `SELECT * FROM attendance WHERE section_ID = ? AND date = ?`,
    [section_ID, date]
  );
  return rows;
}

export async function listAttendanceForStudent(student_ID) {
  const [rows] = await db.query(
    `SELECT * FROM attendance WHERE student_ID = ?`,
    [student_ID]
  );
  return rows;
}


