import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface StudentGrade {
  id: string;
  name: string;
  grade?: string;
}

const Grades: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Fetch students and their grades for the course
  useEffect(() => {
    const fetchStudents = async () => {
      if (!token || !courseId) return;

      try {
        const res = await fetch(`http://localhost:8080/api/teacher/course/${courseId}/grades`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch students");
        const data: StudentGrade[] = await res.json();
        setStudents(data);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : String(err) || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId, token]);

  // Update grade locally
  const updateGrade = (id: string, grade: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, grade } : s))
    );
  };

  // Save grades to backend
  const saveGrades = async () => {
    if (!token || !courseId) return;
    setSaving(true);

    try {
      const res = await fetch(`http://localhost:8080/api/teacher/course/${courseId}/grades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          students.map((s) => ({ studentId: s.id, grade: s.grade }))
        ),
      });

      if (!res.ok) throw new Error("Failed to save grades");
      alert("Grades saved successfully!");
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : String(err) || "Failed to save grades");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading students...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (students.length === 0) return <p>No students enrolled in this course.</p>;

  return (
    <div className="grades-page">
      <h2>Grades for Course {courseId}</h2>
      <table className="grades-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>
                <input
                  type="text"
                  value={s.grade || ""}
                  onChange={(e) => updateGrade(s.id, e.target.value.toUpperCase())}
                  placeholder="Enter grade (A, B+, ...)"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={saveGrades} disabled={saving}>
        {saving ? "Saving..." : "Save Grades"}
      </button>
    </div>
  );
};

export default Grades;
