import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance"; // ✅ ตัวนี้แนบ token ให้อัตโนมัติ


axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role_id: "",
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const baseURL = "http://localhost:5000";
  // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users", { headers });
      if (Array.isArray(res.data)) setUsers(res.data);
      else console.error("Users is not array:", res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get("/api/roles");

      console.log("roles fetched:", res.data); // 👈 ลองดูตรงนี้
      if (Array.isArray(res.data)) setRoles(res.data);
      else console.error("Roles is not array:", res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleRoleChange = async (userId, newRoleId) => {
    await axios.put(
      `/api/users/${userId}/role`,
      { role_id: newRoleId },
      { headers }
    );
    fetchUsers();
  };

  const handleDelete = async (userId) => {
    if (window.confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) {
      await axios.delete(`/api/users/${userId}`, { headers });
      fetchUsers();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password || !newUser.role_id)
      return alert("กรอกข้อมูลให้ครบ");
    await axios.post("/api/auth/register", newUser, { headers });
    setNewUser({ username: "", password: "", role_id: "" });
    fetchUsers();
  };

  // เรียกใช้ฟังก์ชันดึงข้อมูลผู้ใช้และ roles เมื่อคอมโพเนนต์ถูกเรนเดอร์
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">👥 จัดการผู้ใช้</h1>

      <form
        onSubmit={handleRegister}
        className="mb-6 bg-gray-50 p-4 rounded border"
      >
        <h2 className="text-lg font-semibold mb-2">➕ เพิ่มผู้ใช้ใหม่</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="ชื่อผู้ใช้"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            className="border px-2 py-1 rounded w-1/3"
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="border px-2 py-1 rounded w-1/3"
          />
          <select
            value={newUser.role_id}
            onChange={(e) =>
              setNewUser({ ...newUser, role_id: e.target.value })
            }
            className="border px-2 py-1 rounded w-1/3"
          >
            <option value="">เลือกบทบาท</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            เพิ่ม
          </button>
        </div>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border">ชื่อผู้ใช้</th>
            <th className="p-2 border">บทบาท</th>
            <th className="p-2 border">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={user.id} className="text-center">
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">
                <select
                  value={user.role_id}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2 border">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(user.id)}
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
