import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Get API base URL from env var, fall back to relative path
  const rawApiUrl = process.env.REACT_APP_API_URL || '';
  let apiBase = rawApiUrl;
  try {
    if (apiBase.endsWith('/api/chat')) apiBase = apiBase.replace(/\/api\/chat$/, '/api');
    if (apiBase.endsWith('/')) apiBase = apiBase.slice(0, -1);
  } catch (e) {
    apiBase = rawApiUrl;
  }
  const SIGNUP_ENDPOINT = apiBase ? `${apiBase}/auth/signup` : '/api/auth/signup';

  const signup = async () => {
    if (!username || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch(SIGNUP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: "Signup failed" }));
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={signup}>Signup</button>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
