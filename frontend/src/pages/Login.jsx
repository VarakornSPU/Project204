import { useState } from 'react';
import axios from 'axios';

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
      window.location.href = '/pr'; // เปลี่ยนเส้นทางไปหน้า PR
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <form onSubmit={handleLogin} className='bg-white p-6 rounded shadow-md'>
        <h2 className='text-xl mb-4'>Login</h2>
        <input className='block border p-2 mb-2 w-full' type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className='block border p-2 mb-2 w-full' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className='text-red-500'>{error}</p>}
        <button className='bg-blue-500 text-white px-4 py-2 rounded' type='submit'>Login</button>
      </form>
    </div>
  );
}
