import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TeacherCourse {
  id: string;
  code: string;
  title: string;
  section: string;
  year: number;
  semester: number;
  enrolledStudents: number;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/teacher/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch courses");

        const data: TeacherCourse[] = await res.json();
        setCourses(data);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : String(err) || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (courses.length === 0) return <p>No courses assigned.</p>;

  return (
    <div className="teacher-courses">
      <h2>My Courses</h2>
      <table className="courses-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Section</th>
            <th>Year</th>
            <th>Semester</th>
            <th>Enrolled</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.code}</td>
              <td>{course.title}</td>
              <td>{course.section}</td>
              <td>{course.year}</td>
              <td>{course.semester}</td>
              <td>{course.enrolledStudents}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/teacher/roster/${course.id}`)
                  }
                  style={{ marginRight: "8px" }}
                >
                  Students
                </button>
                <button
                  onClick={() =>
                    navigate(`/teacher/attendance/${course.id}`)
                  }
                  style={{ marginRight: "8px" }}
                >
                  Attendance
                </button>
                <button
                  onClick={() =>
                    navigate(`/teacher/grades/${course.id}`)
                  }
                >
                  Grades
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;
