import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/adminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";

/**
 * App Component
 * 
 * The main entry point for application routing. It defines the navigation structure
 * and protects sensitive routes using the ProtectedRoute component.
 */
function App() {
  return (

    <Routes>
      {/* 
        Redirect root path to /login 
        Ensures users land on the login page by default.
      */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* 
        Public Route: Login Page
        Accessible to all users without authentication.
      */}
      <Route path="/login" element={<Login />} />

      {/* 
        Admin Routes
        Restricted to users with the 'admin' role.
        The '*' wildcard allows the AdminDashboard to handle its own sub-routes.
      */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* 
        Teacher Routes
        Restricted to users with the 'teacher' role.
      */}
      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* 
        Student Routes
        Restricted to users with the 'student' role.
      */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>

  );
}

export default App;
