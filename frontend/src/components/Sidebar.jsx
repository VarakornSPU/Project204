// 📁 src/components/Sidebar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = token ? jwtDecode(token).role : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // ✅ ลบ role ด้วย
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2>📂 เมนู</h2>
      <ul>
        {/* Admin only */}
        {role === "admin" && (
          <>
            <li>
              <Link to="/users">👤 จัดการผู้ใช้</Link>
            </li>
            <li>
              <Link to="/report">📊 รายงานภาพรวม</Link>
            </li>
          </>
        )}

        {/* Procurement */}
        {(role === "procurement" || role === "admin") && (
          <>
            <li>
              <Link to="/pr">📝 สร้าง PR</Link>
            </li>
            <li>
              <Link to="/po">📦 ออก PO</Link>
            </li>
            <li>
              <Link to="/receive">📥 รับพัสดุ</Link>
            </li>
            <li>
              <Link to="/asset">🏷️ ทะเบียนพัสดุ</Link>
            </li>
          </>
        )}

        {/* Finance */}
        {(role === "finance" || role === "admin") && (
          <>
            <li>
              <Link to="/budget">📊 งบประมาณ</Link>
            </li>
            <li>
              <Link to="/invoice">🧾 สร้างใบแจ้งหนี้</Link>
            </li>
            <li>
              <Link to="/payment">💸 ชำระเงิน</Link>
            </li>
            <li>
              <Link to="/report">📄 รายงานการเงิน</Link>
            </li>
          </>
        )}

        {/* Management */}
        {(role === "management" || role === "admin") && (
          <>
            <li>
              <Link to="/report">📈 รายงานวิเคราะห์งบ</Link>
            </li>
            <li>
              <Link to="/approve-pr">✅ อนุมัติใบขอซื้อ</Link>
            </li>
          </>
        )}

        {/* IT */}
        {role === "it" && (
          <li>
            <Link to="/users">🛠️ ระบบผู้ใช้</Link>
          </li>
        )}
      </ul>
      <button onClick={handleLogout}>🚪 ออกจากระบบ</button>
    </div>
  );
};

export default Sidebar;
