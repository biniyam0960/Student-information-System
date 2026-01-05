import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  code: string;
  title: string;
  credit: number;
  department?: string;
  instructor?: string;
}

const MAX_CREDITS = 24; // Maximum allowed credits per semester

const CourseRegistration = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // 🔹 Fetch all courses from backend
  useEffect(() => {
    if (!token) {
      setError("Not authenticated");
      navigate("/");
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data: Course[] = await res.json();
        setCourses(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, navigate]);

  // 🔹 Select/deselect course
  const toggleCourse = (course: Course) => {
    setSelectedCourses((prev) =>
      prev.some((c) => c.id === course.id)
        ? prev.filter((c) => c.id !== course.id)
        : [...prev, course]
    );
  };

  const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credit, 0);

  // 🔹 Submit selected courses to backend
  const handleSubmit = async () => {
    if (!token) return navigate("/");

    if (totalCredits > MAX_CREDITS) {
      alert(`Total credits exceed maximum allowed (${MAX_CREDITS})`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/api/student/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseIds: selectedCourses.map((c) => c.id) }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || "Registration failed");

      alert("Registration successful!");
      setSelectedCourses([]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.department && c.department.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="registration-page">
      <h2>Course Registration</h2>

      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "8px", width: "100%", marginBottom: "16px" }}
      />

      <div className="registration-layout">
        {/* Course List */}
        <div className="course-list">
          {filteredCourses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            filteredCourses.map((course) => (
              <label key={course.id} className="course-item">
                <input
                  type="checkbox"
                  checked={selectedCourses.some((c) => c.id === course.id)}
                  onChange={() => toggleCourse(course)}
                />
                <span>
                  <strong>{course.code}</strong> — {course.title} (
                  {course.credit} cr)
                  {course.department && ` | ${course.department}`}
                  {course.instructor && ` | Instructor: ${course.instructor}`}
                </span>
              </label>
            ))
          )}
        </div>

        {/* Selected Courses Summary */}
        <div className="summary">
          <h3>Selected Courses</h3>
          {selectedCourses.length === 0 ? (
            <p>No courses selected</p>
          ) : (
            <ul>
              {selectedCourses.map((c) => (
                <li key={c.id}>
                  {c.code} ({c.credit} cr){" "}
                  {c.department ? `| ${c.department}` : ""}
                </li>
              ))}
            </ul>
          )}
          <p>Total Credits: <strong>{totalCredits}</strong></p>
          {totalCredits > MAX_CREDITS && (
            <p style={{ color: "red" }}>
              Total credits exceed the maximum allowed ({MAX_CREDITS})
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={selectedCourses.length === 0 || submitting}
          >
            {submitting ? "Submitting..." : "Register Selected Courses"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration;
