const request = require('supertest');
const app = require('../../src/app');

// 后端接口验收测试（目标测试）：根据 acceptanceCriteria 编写，当前应失败

describe('Auth API acceptance', () => {
  describe('POST /api/auth/request-code', () => {
    it('当手机号格式正确时返回200且ttlSeconds=60', async () => {
      const res = await request(app)
        .post('/api/auth/request-code')
        .send({ phoneNumber: '13800000000' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({ message: '验证码已发送', ttlSeconds: 60 })
      );
    });
    it('手机号格式无效时返回400并提示', async () => {
      const res = await request(app)
        .post('/api/auth/request-code')
        .send({ phoneNumber: '123' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual(
        expect.objectContaining({ error: '请输入正确的手机号码' })
      );
    });
  });

  describe('POST /api/auth/login', () => {
    it('未注册的手机号登录返回404并提示', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: '13900000000', verificationCode: '123456' });
      expect(res.status).toBe(404);
      expect(res.body).toEqual(
        expect.objectContaining({ error: '该手机号未注册，请先完成注册' })
      );
    });
    it('已注册手机号但验证码错误返回400', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: '13800000000', verificationCode: '000000' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual(expect.objectContaining({ error: '验证码错误' }));
    });
    it('已注册手机号且验证码正确返回200并redirectTo=/', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ phoneNumber: '13800000000', verificationCode: '123456' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({ message: '登录成功', redirectTo: '/' })
      );
    });
  });

  describe('POST /api/auth/register/request-code', () => {
    it('当手机号格式正确时返回200且ttlSeconds=60', async () => {
      const res = await request(app)
        .post('/api/auth/register/request-code')
        .send({ phoneNumber: '13800000001' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({ message: '验证码已发送', ttlSeconds: 60 })
      );
    });
  });

  describe('POST /api/auth/register', () => {
    it('未勾选协议返回412并提示', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ phoneNumber: '13800000001', verificationCode: '123456', agreeProtocol: false });
      expect(res.status).toBe(412);
      expect(res.body).toEqual(
        expect.objectContaining({ error: '请先同意《淘贝用户协议》' })
      );
    });
    it('已注册手机号 + 正确验证码 返回409并提示直接登录', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ phoneNumber: '13800000000', verificationCode: '123456', agreeProtocol: true });
      expect(res.status).toBe(409);
      expect(res.body).toEqual(
        expect.objectContaining({ error: '该手机号已注册，将直接为您登录' })
      );
    });
    it('未注册 + 正确验证码 + 勾选协议 返回200并redirectTo=/', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ phoneNumber: '13800000001', verificationCode: '123456', agreeProtocol: true });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({ message: '注册成功', redirectTo: '/' })
      );
    });
  });
});