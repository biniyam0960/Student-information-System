import React, { useEffect, useState } from "react";

interface Grade {
  course: string;
  grade: string;
}

const Grades: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/grades")
      .then(res => res.json())
      .then(data => {
        setGrades(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const gradeClass = (grade: string) => {
    if (grade.startsWith("A")) return "grade-A";
    if (grade.startsWith("B")) return "grade-B";
    return "grade-C";
  };

  if (loading) return <p>Loading grades...</p>;
  if (grades.length === 0) return <p>No grades available.</p>;

  return (
    <div>
      <h2>My Grades</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((item, index) => (
            <tr key={index}>
              <td>{item.course}</td>
              <td className={gradeClass(item.grade)}>{item.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grades;