import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // JWT token check
  if (!token) {
    return <Navigate to="/login" />; // not logged-in → redirect to login
  }
  return children; // logged-in → render page
};

export default ProtectedRoute;
