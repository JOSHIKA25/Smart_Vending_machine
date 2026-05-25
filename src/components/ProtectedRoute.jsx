import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // If not logged in → go to correct login page
  if (!user) {
    return (
      <Navigate
        to={role === "admin" ? "/admin/login" : "/user/login"}
        replace
      />
    );
  }

  // If wrong role → force correct login page
  if (user.role !== role) {
    localStorage.removeItem("user");  // 🔥 clear old login
    return (
      <Navigate
        to={role === "admin" ? "/admin/login" : "/user/login"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;