import { body } from "express-validator";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../models/courseModel.js";

export const createCourseValidators = [
  body("title").isString().notEmpty().trim(),
  body("credits").isInt({ gt: 0 }),
];

export const updateCourseValidators = [
  body("title").optional().isString().notEmpty().trim(),
  body("credits").optional().isInt({ gt: 0 }),
];

export async function createCourseHandler(req, res, next) {
  try {
    const { title, credits } = req.body;
    const course = await createCourse({ title, credits });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
}

export async function listCoursesHandler(req, res, next) {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

export async function getCourseHandler(req, res, next) {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    next(err);
  }
}

export async function updateCourseHandler(req, res, next) {
  try {
    const existing = await getCourseById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Course not found" });
    }
    const updated = await updateCourse(req.params.id, {
      title: req.body.title ?? existing.title,
      credits: req.body.credits ?? existing.credits,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteCourseHandler(req, res, next) {
  try {
    const ok = await deleteCourse(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}


