import { body } from "express-validator";
import { getStudentByUserId } from "../models/studentModel.js";
import {
  createEnrollment,
  getEnrollment,
  listEnrollmentsByStudent,
  listEnrollmentsBySection,
  updateEnrollmentStatus,
} from "../models/enrollmentModel.js";
import { getSectionById, countEnrolledInSection } from "../models/sectionModel.js";

export const enrollmentValidators = [
  body("section_ID").isInt({ gt: 0 }),
];

// Student enroll in a section (handles capacity vs waitlist)
export async function enrollInSectionHandler(req, res, next) {
  try {
    // Map auth user -> student_ID
    const student = await getStudentByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ error: "No student record for user" });
    }

    const { section_ID } = req.body;

    const section = await getSectionById(section_ID);
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    const existing = await getEnrollment(student.student_ID, section_ID);
    if (existing && existing.status === "enrolled") {
      return res.status(400).json({ error: "Already enrolled in this section" });
    }

    const enrolledCount = await countEnrolledInSection(section_ID);
    const status =
      enrolledCount < section.capacity ? "enrolled" : "waitlisted";

    const enrollment = await createEnrollment({
      student_ID: student.student_ID,
      section_ID,
      status,
    });

    res.status(201).json(enrollment);
  } catch (err) {
    next(err);
  }
}

export async function dropEnrollmentHandler(req, res, next) {
  try {
    const student = await getStudentByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ error: "No student record for user" });
    }
    const { section_ID } = req.body;

    const existing = await getEnrollment(student.student_ID, section_ID);
    if (!existing) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    const updated = await updateEnrollmentStatus(
      existing.enrollment_ID,
      "dropped"
    );

    // NOTE: In a real DB-backed system, here we'd pull the first waitlisted student and promote them.

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function listMyEnrollmentsHandler(req, res, next) {
  try {
    const student = await getStudentByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ error: "No student record for user" });
    }
    const enrollments = await listEnrollmentsByStudent(student.student_ID);
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
}

export async function listEnrollmentsBySectionHandler(req, res, next) {
  try {
    const enrollments = await listEnrollmentsBySection(req.params.sectionId);
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
}


