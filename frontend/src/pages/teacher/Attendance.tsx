import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Student {
  id: string;
  name: string;
  attendance?: boolean; // true = present, false = absent
}

/**
 * Teacher Attendance Component
 * 
 * Allows a teacher to view and manage attendance for a specific course.
 * - Fetches the list of enrolled students.
 * - Toggles attendance status (present/absent) locally.
 * - Submits bulk attendance data to the backend.
 */
const Attendance: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  // State for students list and UI status
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Fetch enrolled students for the course on mount
  useEffect(() => {
    const fetchStudents = async () => {
      if (!token || !courseId) return;

      try {
        const res = await fetch(`/api/teacher/course/${courseId}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch students");

        const data: Student[] = await res.json();
        // Default attendance = false if not provided by backend
        setStudents(data.map((s) => ({ ...s, attendance: s.attendance || false })));
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : String(err) || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId, token]);

  /**
   * Toggles the attendance status of a single student in the local state.
   */
  const toggleAttendance = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attendance: !s.attendance } : s))
    );
  };

  /**
   * Saves the current attendance state for all students to the backend.
   */
  const saveAttendance = async () => {
    if (!token || !courseId) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/teacher/course/${courseId}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          students.map((s) => ({ studentId: s.id, present: s.attendance }))
        ),
      });

      if (!res.ok) throw new Error("Failed to save attendance");
      alert("Attendance saved successfully!");
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : String(err) || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading students...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (students.length === 0) return <p>No students enrolled in this course.</p>;

  return (
    <div className="attendance-page">
      <h2>Attendance for Course {courseId}</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Present</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>
                <input
                  type="checkbox"
                  checked={s.attendance}
                  onChange={() => toggleAttendance(s.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={saveAttendance} disabled={saving}>
        {saving ? "Saving..." : "Save Attendance"}
      </button>
    </div>
  );
};

export default Attendance;
