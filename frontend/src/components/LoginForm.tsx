import React, { useState } from 'react';
import { apiService } from '../services/api';
import './LoginForm.css';

export default function LoginForm(props: { onLoginSuccess?: () => void }) {
  const { onLoginSuccess } = props;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(0);

  const isValidPhone = (p: string) => /^1\d{10}$/.test(p);
  
  const startCountdown = (seconds: number) => {
    setCountdownSeconds(seconds);
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const requestCode = async () => {
    setError(null);
    if (!isValidPhone(phoneNumber)) {
      setError('请输入正确的手机号码');
      return;
    }

    // 新规则：如果在冷却期内，显示提示弹窗而不是禁用按钮
    if (countdownSeconds > 0) {
      alert('六十秒内不要重复获取');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.requestLoginCode(phoneNumber);
      if (response.success && response.data) {
        startCountdown(response.data.ttlSeconds);
      } else {
        setError(response.error || '获取验证码失败');
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!isValidPhone(phoneNumber)) {
        setError('请输入正确的手机号码');
        return;
      }
      
      if (!verificationCode) {
        setError('请输入验证码');
        return;
      }

      const response = await apiService.login(phoneNumber, verificationCode);
      if (response.success) {
        onLoginSuccess && onLoginSuccess();
      } else {
        // 根据后端错误码设置相应的错误信息
        if (response.error?.includes('404')) {
          setError('该手机号未注册，请先完成注册');
        } else if (response.error?.includes('400')) {
          setError('验证码错误或已过期');
        } else {
          setError(response.error || '登录失败');
        }
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form">
      <div className="form-group">
        <label htmlFor="phone">手机号</label>
        <input 
          id="phone"
          aria-label="phone" 
          type="tel"
          placeholder="请输入手机号"
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="code">验证码</label>
        <div className="code-input-group">
          <input 
            id="code"
            aria-label="code" 
            type="text"
            placeholder="请输入验证码"
            value={verificationCode} 
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={isLoading}
          />
          <button 
            className="code-button"
            disabled={isLoading || !isValidPhone(phoneNumber)} 
            onClick={requestCode}
          >
            {countdownSeconds > 0 ? `${countdownSeconds}s` : '获取验证码'}
          </button>
        </div>
      </div>
      
      {error && <div className="error-message" role="alert">{error}</div>}
      
      <button 
        className="submit-button"
        onClick={login}
        disabled={isLoading || !phoneNumber || !verificationCode}
      >
        {isLoading ? '登录中...' : '登录'}
      </button>
    </div>
  );
}