import { body } from "express-validator";
import { getStudentByUserId } from "../models/studentModel.js";
import { createAssignment, listAssignmentsBySection } from "../models/assignmentModel.js";
import { upsertGrade, listGradesByStudent, listGradesByStudentInSection } from "../models/gradeModel.js";
import { calculateFinalGradeForSection, letterGradeFromPercent } from "../services/gpaService.js";

export const createAssignmentValidators = [
  body("section_ID").isInt({ gt: 0 }),
  body("title").isString().notEmpty().trim(),
  body("max_score").isFloat({ gt: 0 }),
  body("weight").isFloat({ gt: 0 }),
];

export const gradeValidators = [
  body("assignment_ID").isInt({ gt: 0 }),
  body("student_ID").isInt({ gt: 0 }),
  body("score").isFloat({ min: 0 }),
];

export async function createAssignmentHandler(req, res, next) {
  try {
    const assignment = await createAssignment(req.body);
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
}

export async function listAssignmentsForSectionHandler(req, res, next) {
  try {
    const assignments = await listAssignmentsBySection(req.params.sectionId);
    res.json(assignments);
  } catch (err) {
    next(err);
  }
}

export async function upsertGradeHandler(req, res, next) {
  try {
    const grade = await upsertGrade(req.body);
    res.status(201).json(grade);
  } catch (err) {
    next(err);
  }
}

export async function mySectionGradesHandler(req, res, next) {
  try {
    const student = await getStudentByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ error: "No student record for user" });
    }
    const grades = await listGradesByStudentInSection(
      student.student_ID,
      req.params.sectionId
    );
    res.json(grades);
  } catch (err) {
    next(err);
  }
}

export async function myGpaHandler(req, res, next) {
  try {
    const student = await getStudentByUserId(req.user.userId);
    if (!student) {
      return res.status(400).json({ error: "No student record for user" });
    }
    const grades = await listGradesByStudent(student.student_ID);

    const bySection = new Map();
    for (const g of grades) {
      if (!bySection.has(g.section_ID)) bySection.set(g.section_ID, []);
      bySection.get(g.section_ID).push(g);
    }

    const finals = [];
    for (const [sectionId, arr] of bySection.entries()) {
      const pct = calculateFinalGradeForSection(arr);
      const letter = letterGradeFromPercent(pct);
      finals.push({ section_ID: sectionId, percent: pct, letter });
    }

    let totalPoints = 0;
    let count = 0;
    for (const f of finals) {
      const pts = letterGradeFromPercent(f.percent)
        ? (f.letterPoints = null, null)
        : null;
    }

    let gpa = null;
    if (finals.length) {
      let sum = 0;
      let n = 0;
      for (const f of finals) {
        const letter = f.letter;
        if (!letter) continue;
        // reuse gradePointsFromLetter lazily
        // 4=A, 3=B, 2=C, 1=D, 0=F
        let pts = 0;
        if (letter === "A") pts = 4;
        else if (letter === "B") pts = 3;
        else if (letter === "C") pts = 2;
        else if (letter === "D") pts = 1;
        else pts = 0;
        sum += pts;
        n++;
      }
      gpa = n ? sum / n : null;
    }

    res.json({
      student_ID: student.student_ID,
      finals,
      gpa,
    });
  } catch (err) {
    next(err);
  }
}


