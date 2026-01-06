import { Routes, Route } from "react-router-dom";
import TeacherTopbar from "../../components/TeacherTopbar";
import Profile from "./Profile";
import Courses from "./Courses";
import Schedule from "./Schedule";
import Grades from "./Grades";
import Attendance from "./Attendance";
import StudentRoster from "./StudentRoster";
import "../../style/dashboard.css";

const TeacherDashboard = () => {
  return (
    <div className="teacher-layout">
      <TeacherTopbar />

      <div className="teacher-content">
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="courses" element={<Courses />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="grades/:courseId" element={<Grades />} />
          <Route path="attendance/:courseId" element={<Attendance />} />
          <Route path="roster/:courseId" element={<StudentRoster />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeacherDashboard;
