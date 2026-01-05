import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBook,
  FaCalendarAlt,
  FaChartBar,
  FaSignOutAlt,
  FaCalendarCheck,
  FaUserPlus,
} from "react-icons/fa";

/**
 * StudentTopbar Component
 * 
 * Provides the main navigation for the Student Dashboard.
 * Includes links to Profile, Courses, Schedule, Grades, Attendance, and Registration.
 * Also handles user logout.
 */
const StudentTopbar: React.FC = () => {
  const navigate = useNavigate();

  // Helper code to apply 'active' class to the current route's link
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active" : "nav-link";

  /**
   * Clears the user session and redirects to the login page.
   */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="logo">🎓 Student Portal</div>

      <nav className="nav-links">
        <NavLink to="/student/profile" className={linkClass}>
          <FaUser className="nav-icon" />
          Profile
        </NavLink>

        <NavLink to="/student/courses" className={linkClass}>
          <FaBook className="nav-icon" />
          Courses
        </NavLink>

        <NavLink to="/student/schedule" className={linkClass}>
          <FaCalendarAlt className="nav-icon" />
          Schedule
        </NavLink>

        <NavLink to="/student/grades" className={linkClass}>
          <FaChartBar className="nav-icon" />
          Grades
        </NavLink>
        <NavLink to="/student/attendance" className={linkClass}>
          <FaCalendarCheck className="nav-icon" />
          Attendance
        </NavLink>
        <NavLink to="/student/registration" className={linkClass}>
          <FaUserPlus className="nav-icon" />
          Registration
        </NavLink>
      </nav>

      <div className="user-actions">


        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="nav-icon" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentTopbar;
