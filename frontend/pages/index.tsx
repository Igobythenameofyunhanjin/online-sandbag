import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [ip, setIp] = useState('');
  const [userId, setUserId] = useState('');

  // Get user's IP automatically on page load
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        setIp(data.ip);
      } catch (err) {
        console.error('Failed to fetch IP:', err);
      }
    };
    fetchIp();
  }, []);

  const handleSignup = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/signup', {
        ip,
        nickname,
        password,
      });
      alert('Signup successful! Please login.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Signup failed.');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        ip,
        nickname,
        password,
      });
      alert('Login successful!');
      setUserId(res.data.userId);
      localStorage.setItem('userId', res.data.userId);
      // Redirect to Comments page after login
      window.location.href = '/comments';
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6">🧱 Online Sandbag</h1>

      <div className="mb-4 p-4 bg-white rounded shadow w-full max-w-md">
        <p className="mb-4">Your IP: <span className="font-mono">{ip || 'Loading...'}</span></p>

        <input
          type="text"
          placeholder="Nickname"
          className="mb-2 p-2 w-full border rounded"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 w-full border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-between">
          <button onClick={handleLogin} className="p-2 bg-green-500 text-white rounded w-[48%]">
            Login
          </button>
          <button onClick={handleSignup} className="p-2 bg-yellow-500 text-white rounded w-[48%]">
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
