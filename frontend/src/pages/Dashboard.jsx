import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || !role) {
      return navigate('/login');
    }

    switch (role) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'procurement':
        navigate('/procurement-dashboard');
        break;
      case 'finance':
        navigate('/finance-dashboard');
        break;
      case 'management':
        navigate('/management-dashboard');
        break;
      case 'it':
        navigate('/it-dashboard');
        break;
      default:
        navigate('/login');
    }
  }, [navigate]);

  return null;
}
