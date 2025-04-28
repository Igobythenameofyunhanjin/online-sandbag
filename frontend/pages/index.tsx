import { useState } from 'react';

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [ip, setIp] = useState('');

  const fetchIp = async () => {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    setIp(data.ip);
  };

  const handleLogin = async () => {
    // API call for login
  };

  const handleSignup = async () => {
    // API call for signup
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🧱 Online Sandbag</h1>

      <button onClick={fetchIp} className="mb-4 p-2 bg-blue-500 text-white rounded">
        Fetch My IP
      </button>

      {ip && <p className="mb-4">Your IP: {ip}</p>}

      <input
        type="text"
        placeholder="Nickname"
        className="mb-2 p-2 border"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="mb-4 p-2 border"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex space-x-4">
        <button onClick={handleLogin} className="p-2 bg-green-500 text-white rounded">
          Login
        </button>
        <button onClick={handleSignup} className="p-2 bg-yellow-500 text-white rounded">
          Signup
        </button>
      </div>
    </div>
  );
}
