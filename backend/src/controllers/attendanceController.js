import { body } from "express-validator";
import { getStudentByUserId } from "../models/studentModel.js";
import {
  markAttendance,
  listAttendanceForSectionOnDate,
  listAttendanceForStudent,
} from "../models/attendanceModel.js";

export const markAttendanceValidators = [
  body("section_ID").isInt({ gt: 0 }),
  body("student_ID").isInt({ gt: 0 }),
  body("date").isISO8601().toDate(),
  body("status").isIn(["present", "absent", "late"]),
];

export async function markAttendanceHandler(req, res, next) {
  try {
    const record = await markAttendance(req.body);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
}

export async function listSectionAttendanceHandler(req, res, next) {
  try {
    const { sectionId } = req.params;
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: "date query parameter is required" });
    }
    const records = await listAttendanceForSectionOnDate(sectionId, date);
    res.json(records);
  } catch (err) {
    next(err);
  }
}

export async function myAttendanceHandler(req, res, next) {
  try {
    const student = await getStudentByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ error: "No student record for user" });
    }
    const records = await listAttendanceForStudent(student.student_ID);
    res.json(records);
  } catch (err) {
    next(err);
  }
}


