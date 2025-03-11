import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Dashboard from '@/components/page/DashBoard';
import { Layout } from '@/components/layout';
import StudentManagement from '@/components/page/StudentManagement';
import DeviceManagement from '@/components/page/DeviceManagement';
import Login from './components/page/Login';
import { useEffect, useState } from 'react';

// Component wrapper để kiểm tra và quyết định có hiển thị Layout hay không
const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Thêm loading state

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn && !isLoginPage) {
      navigate('/login'); // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
    } else {
      setIsLoading(false); // Đã kiểm tra xong, tắt loading
    }
  }, [navigate, isLoginPage]);

  // Nếu đang loading, không render gì cả
  if (isLoading) {
    return null; // Hoặc bạn có thể render một spinner loading
  }

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/student-management" element={<StudentManagement />} />
            <Route path="/device-management" element={<DeviceManagement />} />
          </Routes>
        </Layout>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;