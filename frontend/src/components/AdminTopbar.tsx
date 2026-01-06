import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaUser,
  FaUsers,
  FaBookOpen,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminTopbar: React.FC = () => {
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active" : "nav-link";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="logo"><FaUserShield className="logo-icon" /> Admin Panel</div>

      <nav className="nav-links">
        <NavLink to="/admin/profile" className={linkClass}>
          <FaUser className="nav-icon" /> Profile
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          <FaUsers className="nav-icon" /> Users
        </NavLink>
        <NavLink to="/admin/courses" className={linkClass}>
          <FaBookOpen className="nav-icon" /> Courses
        </NavLink>
      </nav>

      <div className="user-actions">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="nav-icon" /> Logout
        </button>
      </div>
    </div>
  );
};

export default AdminTopbar;
