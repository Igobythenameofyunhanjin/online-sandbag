import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';

interface Comment {
  id: string;
  content: string;
  isReadByAdmin: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminLoggedIn');
    if (isAdmin !== 'true') {
      alert('Unauthorized. Please login as admin.');
      window.location.href = '/admin';
    } else {
      fetchComments();
    }
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/comments');
      setComments(res.data);
    } catch (err) {
      alert('Failed to load comments.');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/comments/${id}/read`);
      fetchComments();
    } catch (err) {
      alert('Failed to mark as read.');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🛡️ Admin Control Center</h1>

      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="bg-gray-800 p-4 rounded shadow flex justify-between items-start">
            <div className="w-[90%]">
              <p className="text-base whitespace-pre-line">{c.content}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(c.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  c.isReadByAdmin ? 'bg-red-500' : 'bg-green-400'
                }`}
                title={c.isReadByAdmin ? 'Read' : 'Unread'}
              ></span>
              {!c.isReadByAdmin && (
                <button
                  onClick={() => markAsRead(c.id)}
                  className="text-xs text-blue-300 underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
