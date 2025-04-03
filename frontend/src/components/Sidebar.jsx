import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li><Link to="/pr">Purchase Requests (PR)</Link></li>
        <li><Link to="/po">Purchase Orders (PO)</Link></li>
        <li><Link to="/receive">Receive Goods</Link></li>
        <li><Link to="/issue">Issue Items</Link></li>
        <li><Link to="/asset">Register Asset</Link></li>
        <li><Link to="/payment">Make Payment</Link></li>
        <li><Link to="/report">Report</Link></li>
        <li><Link to="/users">User Management</Link></li>
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}