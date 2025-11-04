import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // optional if you want external CSS

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    setError('');
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'Invalid credentials!');
        return;
      }

      if (data && data.user) {
        localStorage.setItem('lawUser', JSON.stringify(data.user));
      }
      navigate('/home');
    } catch (e) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Segoe UI, sans-serif',
        background: `url("/Rule-of-Law.jpg") no-repeat center center fixed`, // ✅ use image in public folder
        backgroundSize: 'cover', // fill the screen nicely
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: '100vh',
        paddingLeft: '50px',
        margin: 0
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(8px)',
          padding: '30px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}
      >
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>Don't have an account? <Link to="/signup">Signup</Link></p>
      </div>
    </div>
  );
}

export default Login;
