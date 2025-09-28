import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.authtoken) {
      localStorage.setItem("token", data.authtoken);
      navigate("/notes");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded" required />
        <button type="submit" className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-800">Login</button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/signup" className="text-blue-700 hover:underline">Signup</Link>
      </p>
    </div>
  );
}

export default Login;
