import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import PRPage from './pages/PRPage';
import POPage from './pages/POPage';
import ReceivePage from './pages/ReceivePage';
import IssuePage from './pages/IssuePage';
import RegisterAsset from './pages/RegisterAsset';
import MakePayment from './pages/MakePayment';
import ReportPage from './pages/ReportPage';
import UserManagement from './pages/UserManagement';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProcurementDashboard from './pages/ProcurementDashboard';
import FinanceDashboard from './pages/FinanceDashboard';
import ManagementDashboard from './pages/ManagementDashboard';
import ITDashboard from './pages/ITDashboard';
import Unauthorized from './pages/Unauthorized';
import ApprovePRPage from './pages/ApprovePRPage';
import BudgetPage from './pages/BudgetPage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex">
      {isLoggedIn && <Sidebar />}

      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Dashboards by role */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/procurement/dashboard" element={<ProcurementDashboard />} />
          <Route path="/finance/dashboard" element={<FinanceDashboard />} />
          <Route path="/management/dashboard" element={<ManagementDashboard />} />
          <Route path="/it/dashboard" element={<ITDashboard />} />

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Function pages */}
          <Route path="/pr" element={<PRPage />} />
          <Route path="/po" element={<POPage />} />
          <Route path="/receive" element={<ReceivePage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/issue" element={<IssuePage />} />
          <Route path="/asset" element={<RegisterAsset />} />
          <Route path="/payment" element={<MakePayment />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/approve-pr" element={<ApprovePRPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
