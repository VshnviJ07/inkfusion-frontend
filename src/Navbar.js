
// src/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

 

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow bg-white dark:bg-gray-800 text-black dark:text-white">
      <h1 className="font-bold text-xl text-blue-700 dark:text-blue-400">InkFusion</h1>
      <div className="flex items-center space-x-4">
        <Link className="hover:font-bold" to="/">Home</Link>
        <Link className="hover:font-bold" to="/about">About</Link>
        {isLoggedIn && <Link className="hover:font-bold" to="/notes">Notes</Link>}
        {!isLoggedIn ? (
          <>
            <Link className="hover:font-bold" to="/login">Login</Link>
            <Link className="hover:font-bold" to="/signup">Signup</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="hover:font-bold text-red-600">Logout</button>
        )}
        
      </div>
    </nav>
  );
}

export default Navbar;
