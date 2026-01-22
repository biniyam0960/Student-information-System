import { useEffect, useState } from "react";

interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  teacher?: string;
}

interface Props {
  refreshKey?: number; // triggers reload
}

const CourseList = ({ refreshKey }: Props) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch courses whenever refreshKey changes
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/admin/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data: Course[] = await res.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [refreshKey]);

  // Filter courses based on search
  const filteredCourses = courses.filter(
    c =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.teacher && c.teacher.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <p>Loading courses...</p>;
  if (filteredCourses.length === 0) return <p>No courses found.</p>;

  return (
    <div className="course-list-container card">
      <input
        type="text"
        placeholder="Search by code, title, or teacher..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="form-input search-input"
      />

      <table className="table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Credits</th>
            <th>Teacher</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map(course => (
            <tr key={course.id}>
              <td>{course.code}</td>
              <td>{course.title}</td>
              <td>{course.credits}</td>
              <td>{course.teacher || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList;
