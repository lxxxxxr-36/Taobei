import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '../../src/components/RegisterForm';

// 前端注册组件验收测试：依据 acceptanceCriteria，当前应失败

describe('UI-RegisterForm acceptance', () => {
  it('渲染手机号、验证码、协议勾选和注册按钮', () => {
    render(<RegisterForm />);
    expect(screen.getByRole('button', { name: /获取验证码/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /注册/i })).toBeInTheDocument();
    expect(screen.getByLabelText('agree')).toBeInTheDocument();
  });

  it('未勾选协议时注册按钮不可点击；勾选后可点击', async () => {
    render(<RegisterForm />);
    const registerButton = screen.getByRole('button', { name: /注册/i });
    expect(registerButton).toBeDisabled();
    fireEvent.click(screen.getByLabelText('agree'));
    expect(registerButton).not.toBeDisabled();
  });

  it('点击获取验证码后启动60秒倒计时并禁用按钮', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText('phone'), { target: { value: '13800000001' } });
    fireEvent.click(screen.getByRole('button', { name: /获取验证码/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /获取验证码/i })).toBeDisabled();
    });
  });

  it('成功注册时提示并触发 onRegisterSuccess/跳转', async () => {
    render(<RegisterForm onRegisterSuccess={() => {}} />);
    fireEvent.change(screen.getByLabelText('phone'), { target: { value: '13800000001' } });
    fireEvent.change(screen.getByLabelText('code'), { target: { value: '123456' } });
    fireEvent.click(screen.getByLabelText('agree'));
    fireEvent.click(screen.getByRole('button', { name: /注册/i }));
    await waitFor(() => {
      // 目标：应当出现“注册成功”提示或产生跳转
      expect(screen.queryByText(/注册成功/)).toBeInTheDocument();
    });
  });
});