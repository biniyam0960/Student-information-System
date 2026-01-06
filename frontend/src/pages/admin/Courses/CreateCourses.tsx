import { useState } from "react";

interface NewCourse {
  code: string;
  title: string;
  creditHours: number;
  ects: number;
}

interface Props {
  onCourseCreated?: () => void;
}

const CreateCourse = ({ onCourseCreated }: Props) => {
  const [course, setCourse] = useState<NewCourse>({
    code: "",
    title: "",
    creditHours: 0,
    ects: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: name.includes("ects") || name.includes("credit") ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course.code || !course.title) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });

      if (!res.ok) throw new Error("Failed to create course");

      alert("Course created successfully");
      setCourse({ code: "", title: "", creditHours: 0, ects: 0 });
      onCourseCreated?.();
    } catch (err) {
      console.error(err);
      alert("Error creating course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Create New Course</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="code" placeholder="Course Code (e.g., CS101)" value={course.code} onChange={handleChange} required />
        <input type="text" name="title" placeholder="Course Title" value={course.title} onChange={handleChange} required />
        <input type="number" name="creditHours" placeholder="Credit Hours" value={course.creditHours || ""} onChange={handleChange} required />
        <input type="number" name="ects" placeholder="ECTS" value={course.ects || ""} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Course"}</button>
      </form>
    </div>
  );
};

export default CreateCourse;
