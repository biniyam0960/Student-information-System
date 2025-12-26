/**
 * GPA Service - Grade calculation and academic performance utilities
 * Provides functions for calculating final grades and GPA conversion
 */

/**
 * Calculates the final grade percentage for a section based on weighted assignments
 * @param {Array} grades - Array of grade objects with score, max_score, and weight
 * @returns {number|null} Final grade percentage (0-100) or null if no grades
 */
export function calculateFinalGradeForSection(grades) {
  if (!grades || grades.length === 0) return null;
  
  let totalWeighted = 0;
  let totalWeight = 0;
  
  for (const g of grades) {
    const pct = g.max_score ? g.score / g.max_score : 0;
    totalWeighted += pct * g.weight;
    totalWeight += g.weight;
  }
  
  if (!totalWeight) return null;
  
  const finalPct = totalWeighted / totalWeight;
  return finalPct * 100;
}

/**
 * Converts a percentage grade to a letter grade
 * @param {number} pct - Grade percentage (0-100)
 * @returns {string|null} Letter grade (A, B, C, D, F) or null if invalid percentage
 */
export function letterGradeFromPercent(pct) {
  if (pct == null) return null;
  
  if (pct >= 90) return "A";
  if (pct >= 80) return "B";
  if (pct >= 70) return "C";
  if (pct >= 60) return "D";
  return "F";
}

/**
 * Converts a letter grade to grade points for GPA calculation
 * @param {string} letter - Letter grade (A, B, C, D, F)
 * @returns {number} Grade points (4.0 scale)
 */
export function gradePointsFromLetter(letter) {
  switch (letter) {
    case "A":
      return 4.0;
    case "B":
      return 3.0;
    case "C":
      return 2.0;
    case "D":
      return 1.0;
    case "F":
      return 0;
    default:
      return 0;
  }
}


