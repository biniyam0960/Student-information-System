import { body } from "express-validator";
import bcrypt from "bcryptjs";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentByUserId,
  updateStudent,
  deleteStudent,
} from "../models/studentModel.js";
import {
  findUserByEmail,
  createUser,
} from "../models/userModel.js";

export const createStudentValidators = [
  body("username").isString().isLength({ min: 3 }).trim(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("first_name").isString().notEmpty().trim(),
  body("last_name").isString().notEmpty().trim(),
  body("student_ID_number").isString().notEmpty().trim(),
  body("date_of_birth").isISO8601().toDate(),
  body("gender").isIn(["male", "female", "other"]),
  body("address").isString().notEmpty().trim(),
  body("current_status").isIn(["active", "inactive", "graduated", "suspended"]),
];

export const updateStudentValidators = [
  body("student_ID_number").optional().isString().notEmpty().trim(),
  body("date_of_birth").optional().isISO8601().toDate(),
  body("gender").optional().isIn(["male", "female", "other"]),
  body("address").optional().isString().notEmpty().trim(),
  body("current_status")
    .optional()
    .isIn(["active", "inactive", "graduated", "suspended"]),
];

export async function createStudentHandler(req, res, next) {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      student_ID_number,
      date_of_birth,
      gender,
      address,
      current_status,
    } = req.body;

   
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

 
    const user = await createUser({
      username,
      passwordHash,
      email,
      role: "student",
      firstName: first_name,
      lastName: last_name,
    });

    
    const student = await createStudent({
      userId: user.user_ID,
      studentIdNumber: student_ID_number,
      dateOfBirth: date_of_birth,
      gender,
      address,
      currentStatus: current_status,
    });

    res.status(201).json({
      user,
      student,
      message: "Student created successfully"
    });
  } catch (err) {
    next(err);
  }
}

export async function listStudentsHandler(req, res, next) {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (err) {
    next(err);
  }
}

export async function getStudentHandler(req, res, next) {
  try {
    const { id } = req.params;
    let student = await getStudentById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    
    if (req.user.role === "student") {
      const ownStudent = await getStudentByUserId(req.user.userId);
      if (!ownStudent || ownStudent.student_ID !== Number(id)) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    res.json(student);
  } catch (err) {
    next(err);
  }
}

export async function updateStudentHandler(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await getStudentById(id);
    if (!existing) {
      return res.status(404).json({ error: "Student not found" });
    }

    const updated = await updateStudent(id, {
      student_ID_number:
        req.body.student_ID_number ?? existing.student_ID_number,
      date_of_birth: req.body.date_of_birth ?? existing.date_of_birth,
      gender: req.body.gender ?? existing.gender,
      address: req.body.address ?? existing.address,
      current_status: req.body.current_status ?? existing.current_status,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteStudentHandler(req, res, next) {
  try {
    const { id } = req.params;
    const ok = await deleteStudent(id);
    if (!ok) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}


