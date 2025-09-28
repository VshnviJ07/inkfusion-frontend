import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.authtoken) {
      localStorage.setItem("token", data.authtoken);
      navigate("/notes");
    } else {
      alert("Signup failed");
    }
  };

  const onChange = e => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={credentials.name} onChange={onChange}
          className="w-full p-2 mb-4 border rounded" required />
        <input type="email" name="email" placeholder="Email" value={credentials.email} onChange={onChange}
          className="w-full p-2 mb-4 border rounded" required />
        <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={onChange}
          className="w-full p-2 mb-4 border rounded" required />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
