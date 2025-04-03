import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editRole, setEditRole] = useState({});

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user', { headers });
      setUsers(res.data);
    } catch (err) {
      alert('Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${id}`, { headers });
      fetchUsers();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleRoleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/user/${id}/role`, {
        role: editRole[id]
      }, { headers });
      fetchUsers();
    } catch (err) {
      alert('Role update failed');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">User Management</h1>
      <table className="w-full border text-left text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Username</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.username}</td>
              <td className="p-2">
                <input
                  className="border p-1 text-sm"
                  value={editRole[user.id] ?? user.role}
                  onChange={(e) => setEditRole({ ...editRole, [user.id]: e.target.value })}
                />
              </td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleRoleUpdate(user.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
