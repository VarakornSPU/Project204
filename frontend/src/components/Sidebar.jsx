// src/components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ลบ token จาก localStorage
    localStorage.removeItem('token');
    // Redirect ไปหน้า Login
    navigate('/');
  };

  return (
    <div className="sidebar w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <ul>
        <li><Link to="/pr" className="block py-2 px-4 hover:bg-gray-600">Purchase Requests (PR)</Link></li>
        <li><Link to="/po" className="block py-2 px-4 hover:bg-gray-600">Purchase Orders (PO)</Link></li>
        <li><Link to="/receive" className="block py-2 px-4 hover:bg-gray-600">Receive Goods</Link></li>
        <li><Link to="/issue" className="block py-2 px-4 hover:bg-gray-600">Issue Items</Link></li>
        <li><Link to="/asset" className="block py-2 px-4 hover:bg-gray-600">Register Asset</Link></li>
        <li><Link to="/payment" className="block py-2 px-4 hover:bg-gray-600">Make Payment</Link></li>
        <li><Link to="/report" className="block py-2 px-4 hover:bg-gray-600">Report</Link></li>
        <li><Link to="/users" className="block py-2 px-4 hover:bg-gray-600">User Management</Link></li>
      </ul>

      {/* ปุ่ม Logout */}
      <button 
        onClick={handleLogout} 
        className="mt-4 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
