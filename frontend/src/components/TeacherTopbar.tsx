import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaUserTie,
  FaBookOpen,
  FaCalendarAlt,
  FaClipboardList,
  FaClipboardCheck,
  FaSignOutAlt,
} from "react-icons/fa";

const TeacherTopbar = () => {
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active" : "nav-link";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="logo"><FaChalkboardTeacher className="logo-icon" /> Teacher Portal</div>

      <nav className="nav-links">
        <NavLink to="/teacher/profile" className={linkClass}>
          <FaUserTie className="nav-icon" /> Profile
        </NavLink>

        <NavLink to="/teacher/courses" className={linkClass}>
          <FaBookOpen className="nav-icon" /> My Courses
        </NavLink>

        <NavLink to="/teacher/schedule" className={linkClass}>
          <FaCalendarAlt className="nav-icon" /> Schedule
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

export default TeacherTopbar;
