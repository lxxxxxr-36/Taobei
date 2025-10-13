import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import LoginForm from '../../src/components/LoginForm';
import { vi } from 'vitest';

// 前端登录组件验收测试：依据 acceptanceCriteria，当前应失败

describe('UI-LoginForm acceptance', () => {
  it('渲染手机号、验证码输入框和按钮', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: /获取验证码/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
  });

  it('点击获取验证码后启动60秒倒计时并禁用按钮', async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText('phone'), { target: { value: '13800000000' } });
    fireEvent.click(screen.getByRole('button', { name: /获取验证码/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /获取验证码/i })).toBeDisabled();
    });
  });

  it('登录成功时触发 onLoginSuccess', async () => {
    const onLoginSuccess = vi.fn();
    render(<LoginForm onLoginSuccess={onLoginSuccess} />);
    fireEvent.change(screen.getByLabelText('phone'), { target: { value: '13800000000' } });
    fireEvent.change(screen.getByLabelText('code'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /登录/i }));
    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalled();
    });
  });
});