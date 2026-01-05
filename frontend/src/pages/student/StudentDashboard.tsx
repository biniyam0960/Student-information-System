import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentTopbar from "../../components/StudentTopbar";
import Courses from "./Courses";
import Schedule from "./Schedule";
import Grades from "./Grades";
import Profile from "./Profile";
import Registration from "./Registration";
import Attendance from "./Attendance";
import "../../style/dashboard.css";

const StudentDashboard: React.FC = () => {
  return (
    <div className="student-layout">
      <StudentTopbar />
      <div className="student-content">
        <Routes>
          {/* Default landing page is Profile */}
          <Route path="/" element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="courses" element={<Courses />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="grades" element={<Grades />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="registration" element={<Registration />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;
