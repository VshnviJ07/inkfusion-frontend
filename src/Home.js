import React, { useEffect, useState } from "react";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/auth/getuser", {
        method: "POST",
        headers: { "auth-token": token },
      })
        .then(res => res.json())
        .then(data => setUser(data));
    }
  }, []);

  return (
    <div className="flex justify-center items-start pt-20 bg-gray-100 min-h-screen p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome to InkFusion</h1>
        <p className="mb-6 text-gray-700">A real-time MERN notes app with authentication.</p>
        {user && (
          <p className="text-lg text-gray-800">
            Hello, {user.name}! Start managing your notes.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
