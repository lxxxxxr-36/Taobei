import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/home');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">淘贝注册</h1>
        <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
        <div className="auth-switch">
          <span>已有账号？</span>
          <Link to="/login" className="link-button">
            立即登录
          </Link>
        </div>
      </div>
    </div>
  );
}