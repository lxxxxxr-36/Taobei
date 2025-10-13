import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/home');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">淘贝登录</h1>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <div className="auth-switch">
          <span>还没有账号？</span>
          <Link to="/register" className="link-button">
            立即注册
          </Link>
        </div>
      </div>
    </div>
  );
}