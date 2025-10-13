import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>欢迎来到淘贝</h1>
        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          退出登录
        </button>
      </div>
      <div className="home-content">
        <p>登录成功！欢迎使用淘贝平台。</p>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>用户管理</h3>
            <p>管理您的个人信息和账户设置</p>
          </div>
          <div className="feature-card">
            <h3>商品浏览</h3>
            <p>浏览和搜索各种商品</p>
          </div>
          <div className="feature-card">
            <h3>订单管理</h3>
            <p>查看和管理您的订单历史</p>
          </div>
          <div className="feature-card">
            <h3>客服支持</h3>
            <p>获取专业的客户服务支持</p>
          </div>
        </div>
      </div>
    </div>
  );
}