import { useEffect, useState } from "react";

interface Course {
  id: string;
  code: string;
  title: string;
  creditHours: number;
  ects: number;
}

interface Props {
  onAssigned?: () => void;
}

const AssignCourses = ({ onAssigned }: Props) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [semester, setSemester] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/admin/courses");
        const data: Course[] = await res.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Toggle course selection
  const toggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Submit selected courses
  const handleAssign = async () => {
    if (selectedCourses.length === 0 || !year || !semester) {
      alert("Fill all fields and select at least one course.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/api/admin/assign-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseIds: selectedCourses, year, semester }),
      });

      if (!res.ok) throw new Error("Assignment failed");

      alert("Courses assigned successfully!");
      setSelectedCourses([]);
      setYear("");
      setSemester("");
      onAssigned?.();
    } catch (err) {
      console.error(err);
      alert("Error assigning courses");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading courses...</p>;

  // Filter courses based on search
  const filteredCourses = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="assign-card card">
      <h3>Assign Courses to Students</h3>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-input"
      />

      {/* Course selection list */}
      <div className="assign-courses-list">
        {filteredCourses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          filteredCourses.map((c) => (
            <label key={c.id} className="course-item">
              <input
                type="checkbox"
                checked={selectedCourses.includes(c.id)}
                onChange={() => toggleCourse(c.id)}
              />
              {c.code} — {c.title} ({c.creditHours} cr | {c.ects} ECTS)
            </label>
          ))
        )}
      </div>

      {/* Year & Semester */}
      <div className="assign-controls">
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="form-input"
        />

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="form-input"
        >
          <option value="">Select Semester</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>

        <button
          onClick={handleAssign}
          disabled={submitting}
          className="submit-btn"
        >
          {submitting ? "Assigning..." : "Assign Selected Courses"}
        </button>
      </div>
    </div>
  );
};

export default AssignCourses;
