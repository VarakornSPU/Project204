import { useState } from 'react';
import axios from 'axios';
import '../pages/Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      const { token, role } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      const successElement = document.createElement('div');
      successElement.className = 'login-success';
      successElement.innerHTML = '<div class="success-icon">✓</div><div>เข้าสู่ระบบสำเร็จ!</div>';
      document.body.appendChild(successElement);

      setTimeout(() => {
        switch (role) {
          case 'admin':
            window.location.href = '/admin/dashboard';
            break;
          case 'procurement':
            window.location.href = '/procurement/dashboard';
            break;
          case 'finance':
            window.location.href = '/finance/dashboard';
            break;
          case 'management':
            window.location.href = '/management/dashboard';
            break;
          case 'it':
            window.location.href = '/it/dashboard';
            break;
          default:
            window.location.href = '/unauthorized';
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ โปรดตรวจสอบชื่อผู้ใช้และรหัสผ่าน');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>LOGIN</h2>
        <input
          className="input-field"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button className="login-button" type="submit" disabled={isLoading}>
          {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
}
