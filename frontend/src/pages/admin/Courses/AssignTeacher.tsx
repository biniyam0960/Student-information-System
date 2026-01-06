import { useEffect, useState } from "react";

interface Course {
  id: string;
  code: string;
  title: string;
  year?: number;
  semester?: number;
  section?: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface Props {
  onTeacherAssigned?: () => void;
}

const AssignTeacher = ({ onTeacherAssigned }: Props) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch courses and teachers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, teachersRes] = await Promise.all([
          fetch("/api/admin/courses"),
          fetch("/api/admin/users?role=teacher"),
        ]);

        const coursesData: Course[] = await coursesRes.json();
        const teachersData: Teacher[] = await teachersRes.json();

        setCourses(coursesData);
        setTeachers(teachersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedCourse || !selectedTeacher) {
      alert("Please select both course and teacher.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/courses/assign-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse,
          teacherId: selectedTeacher,
        }),
      });

      if (!res.ok) throw new Error("Assignment failed");

      alert("Teacher assigned successfully");
      setSelectedCourse("");
      setSelectedTeacher("");
      onTeacherAssigned?.();
    } catch (err) {
      console.error(err);
      alert("Error assigning teacher");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading courses and teachers...</p>;

  return (
    <div className="assign-teacher-card card">
      <h3>Assign Teacher to Course</h3>

      <div className="assign-teacher-controls">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="form-input"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code} — {c.title} {c.year ? `(Year: ${c.year}, Sem: ${c.semester}, Sec: ${c.section})` : ""}
            </option>
          ))}
        </select>

        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="form-input"
        >
          <option value="">Select Teacher</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          disabled={submitting}
          className="submit-btn"
        >
          {submitting ? "Assigning..." : "Assign"}
        </button>
      </div>
    </div>
  );
};

export default AssignTeacher;
