import { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
  id: string;
  content: string;
  isReadByAdmin: boolean;
  createdAt: string;
}

export default function CommentsPage() {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [userId, setUserId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      alert('Please login first.');
      window.location.href = '/';
      return;
    }
    setUserId(storedUserId);
    fetchComments(storedUserId);
  }, []);

  const fetchComments = async (uid: string) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments`, {
        params: { userId: uid },
      });
      setComments(res.data);
    } catch (err) {
      alert('Failed to fetch comments.');
    }
  };

  const handleCreate = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/comments`, {
        userId,
        content: commentText,
      });
      setCommentText('');
      fetchComments(userId);
    } catch (err) {
      alert('Failed to submit comment.');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/comments/${id}`, {
        userId,
        content: commentText,
      });
      setEditingId(null);
      setCommentText('');
      fetchComments(userId);
    } catch (err) {
      alert('Failed to update comment.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${id}`, {
        data: { userId },
      });
      fetchComments(userId);
    } catch (err) {
      alert('Failed to delete comment.');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">💢 Hit the Sandbag</h1>

      <div className="mb-6">
        <textarea
          className="w-full p-3 border rounded mb-2"
          placeholder="Write your insult to admin here..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        {editingId ? (
          <button onClick={() => handleUpdate(editingId)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Update
          </button>
        ) : (
          <button onClick={handleCreate} className="bg-red-500 text-white px-4 py-2 rounded">
            Punch the Sandbag
          </button>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">🧾 Your Insults</h2>
      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="p-4 bg-white shadow rounded flex items-center justify-between">
            <div className="w-[90%]">
              <p className="text-sm whitespace-pre-line">{c.content}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${c.isReadByAdmin ? 'bg-red-500' : 'bg-green-400'}`} title={c.isReadByAdmin ? 'Read by admin' : 'Not read yet'}></span>
              <button onClick={() => { setEditingId(c.id); setCommentText(c.content); }} className="text-blue-500 text-sm">
                Edit
              </button>
              <button onClick={() => handleDelete(c.id)} className="text-red-500 text-sm">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
