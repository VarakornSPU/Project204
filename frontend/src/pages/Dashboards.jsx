// 📁 src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as jwt_decode from 'jwt-decode';


const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwt_decode.default(token);

      const role = decoded.role;

      // 🔁 Redirect by role
      switch (role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "procurement":
          navigate("/procurement/dashboard");
          break;
        case "finance":
          navigate("/finance/dashboard");
          break;
        case "management":
          navigate("/management/dashboard");
          break;
        case "it":
          navigate("/it/dashboard");
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (err) {
      console.error("Token error", err);
      navigate("/login");
    }
  }, [navigate]);

  return <div>Loading dashboard...</div>;
};

export default Dashboard;
