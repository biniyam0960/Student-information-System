import { useState } from "react";
import CreateCourse from "./CreateCourses";
import AssignTeacher from "./AssignTeacher";
import CourseList from "./CourseList";
import AssignCourses from "./AssignCourses";

const Courses = () => {
  // Using a key to refresh course list after updates
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshCourses = () => setRefreshKey((prev) => prev + 1);

  return (
    <div>
      <h2>Course Management</h2>

      {/* Section 1: Create a new course */}
      <CreateCourse onCourseCreated={refreshCourses} />

      {/* Section 2: Assign a teacher to a course */}
      <AssignTeacher onTeacherAssigned={refreshCourses} />

      {/* Section 3: Assign multiple courses to students */}
      <AssignCourses onAssigned={refreshCourses} />

      {/* Section 4: List all courses */}
      <CourseList refreshKey={refreshKey} />
    </div>
  );
};

export default Courses;
