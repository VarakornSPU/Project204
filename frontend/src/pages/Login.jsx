import { useState } from 'react';
import axios from 'axios';
import "../pages/Login.css";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username, password
      });
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      window.location.href = '/pr';
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="">
      <form onSubmit={handleLogin} className="login-form">
        <h2>LOGIN</h2>
        <input className="input-field" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error-message">{error}</p>}
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
}