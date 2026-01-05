import { Navigate } from "react-router-dom";
import React from "react";

interface Props {
  children: React.ReactElement;
  role: "student" | "teacher" | "admin";
}

/**
 * ProtectedRoute Component
 * 
 * Secures routes by checking for valid authentication and appropriate user roles.
 * If authentication fails or roles don't match, it redirects to the login page.
 * 
 * @param children - The component to render if access is granted.
 * @param role - The required role ("student", "teacher", "admin") to access this route.
 */
const ProtectedRoute = ({ children, role }: Props) => {
  // Retrieve token and user role from localStorage
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role")?.toLowerCase();

  // Check if user is logged in (token exists)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the correct role for this route
  if (userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if all checks pass
  return children;
};

export default ProtectedRoute;
