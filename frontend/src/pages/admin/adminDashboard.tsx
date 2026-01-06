import { Routes, Route } from "react-router-dom";
import AdminTopbar from "../../components/AdminTopbar";
import Profile from "./Profile";
import Users from "./Users/Users";
import Courses from "./Courses/Courses";
import "../../style/dashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-layout">
      <AdminTopbar />

      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="users" element={<Users />} />
          <Route path="courses" element={<Courses />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
