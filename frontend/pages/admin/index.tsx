import { useState } from 'react';
import axios from 'axios';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password,
      });
      alert('Login successful!');
      localStorage.setItem('isAdminLoggedIn', 'true');
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">🔐 Admin Login</h1>

        <input
          type="email"
          placeholder="Admin Email"
          className="mb-3 p-2 w-full border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Admin Password"
          className="mb-4 p-2 w-full border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}
