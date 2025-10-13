import React, { useState } from 'react';
import { apiService } from '../services/api';
import './RegisterForm.css';

export default function RegisterForm(props: { onRegisterSuccess?: () => void }) {
  const { onRegisterSuccess } = props;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [agreeProtocol, setAgreeProtocol] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
    setSuccess(null);
    if (!isValidPhone(phoneNumber)) {
      setError('请输入正确的手机号码');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.requestRegisterCode(phoneNumber);
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

  const register = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (!isValidPhone(phoneNumber)) {
        setError('请输入正确的手机号码');
        return;
      }
      
      if (!verificationCode) {
        setError('请输入验证码');
        return;
      }
      
      if (!agreeProtocol) {
        setError('请先同意《淘贝用户协议》');
        return;
      }

      const response = await apiService.register(phoneNumber, verificationCode, agreeProtocol);
      if (response.success) {
        setSuccess('注册成功');
        onRegisterSuccess && onRegisterSuccess();
      } else {
        // 根据后端错误码设置相应的错误信息
        if (response.error?.includes('409')) {
          setError('该手机号已注册，请直接登录');
        } else if (response.error?.includes('400')) {
          setError('验证码错误或已过期');
        } else if (response.error?.includes('410')) {
          setError('验证码已过期，请重新获取');
        } else if (response.error?.includes('412')) {
          setError('请先同意《淘贝用户协议》');
        } else {
          setError(response.error || '注册失败');
        }
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-form">
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
            disabled={countdownSeconds > 0 || isLoading || !isValidPhone(phoneNumber)} 
            onClick={requestCode}
          >
            {countdownSeconds > 0 ? `${countdownSeconds}s` : '获取验证码'}
          </button>
        </div>
      </div>
      
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            aria-label="agree"
            checked={agreeProtocol}
            onChange={(e) => setAgreeProtocol(e.target.checked)}
            disabled={isLoading}
          />
          <span className="checkbox-text">同意《淘贝用户协议》</span>
        </label>
      </div>
      
      {error && <div className="error-message" role="alert">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <button 
        className="submit-button"
        disabled={!agreeProtocol || isLoading || !phoneNumber || !verificationCode} 
        onClick={register}
      >
        {isLoading ? '注册中...' : '注册'}
      </button>
    </div>
  );
}