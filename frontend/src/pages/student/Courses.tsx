import React, { useEffect, useState } from "react";

interface Course {
  id: number;
  name: string;
  instructor: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/student/courses") 
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (courses.length === 0) return <p>No courses found.</p>;

  return (
    <div>
      <h2>My Courses</h2>
      <div className="course-grid">
        {courses.map(course => (
          <div key={course.id} className="card">
            <h3>{course.name}</h3>
            <p>Instructor: {course.instructor}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Courses;
