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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);  // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
      navigate('/'); // Redirect to login if there's no token
    }
  }, [navigate]);

  return (
    <div className="flex">
      {/* Show Sidebar only if logged in */}
      {isLoggedIn && <Sidebar />}

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/pr" element={<PRPage />} />
          <Route path="/po" element={<POPage />} />
          <Route path="/receive" element={<ReceivePage />} />
          <Route path="/issue" element={<IssuePage />} />
          <Route path="/asset" element={<RegisterAsset />} />
          <Route path="/payment" element={<MakePayment />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
