import { body } from "express-validator";

export const createTeacherValidators = [
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
];

export const updateTeacherValidators = [
  body("first_name").optional().notEmpty().withMessage("First name cannot be empty"),
  body("last_name").optional().notEmpty().withMessage("Last name cannot be empty"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
];

export async function createTeacherHandler(req, res, next) {
  try {
    res.status(501).json({ error: "Not implemented" });
  } catch (err) {
    next(err);
  }
}

export async function listTeachersHandler(req, res, next) {
  try {
    res.status(501).json({ error: "Not implemented" });
  } catch (err) {
    next(err);
  }
}

export async function getTeacherHandler(req, res, next) {
  try {
    res.status(501).json({ error: "Not implemented" });
  } catch (err) {
    next(err);
  }
}

export async function updateTeacherHandler(req, res, next) {
  try {
    res.status(501).json({ error: "Not implemented" });
  } catch (err) {
    next(err);
  }
}

export async function deleteTeacherHandler(req, res, next) {
  try {
    res.status(501).json({ error: "Not implemented" });
  } catch (err) {
    next(err);
  }
}