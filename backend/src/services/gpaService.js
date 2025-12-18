// Basic GPA calculation helpers operating on grade records and course credits.
// In the mock DB environment this will be mostly illustrative.

export function calculateFinalGradeForSection(grades) {
  // grades: [{ score, max_score, weight }]
  if (!grades || grades.length === 0) return null;
  let totalWeighted = 0;
  let totalWeight = 0;
  for (const g of grades) {
    const pct = g.max_score ? g.score / g.max_score : 0;
    totalWeighted += pct * g.weight;
    totalWeight += g.weight;
  }
  if (!totalWeight) return null;
  const finalPct = totalWeighted / totalWeight; // 0..1
  return finalPct * 100;
}

export function letterGradeFromPercent(pct) {
  if (pct == null) return null;
  if (pct >= 90) return "A";
  if (pct >= 80) return "B";
  if (pct >= 70) return "C";
  if (pct >= 60) return "D";
  return "F";
}

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


