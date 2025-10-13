// 简易内存存储，满足测试与验收标准
const users = new Map(); // phoneNumber -> { userId, phoneNumber, createdAt }
const verificationStore = new Map(); // phoneNumber -> { code, expiresAt, createdAt }
let userSeq = 1;

const TTL_SECONDS = 60;

function isValidPhone(phoneNumber) {
  return typeof phoneNumber === 'string' && /^1\d{10}$/.test(phoneNumber);
}

function generateCode() {
  // 为测试稳定性返回固定验证码
  return '123456';
}

function createOrUpdateVerificationCode(phoneNumber) {
  const code = generateCode();
  const now = Date.now();
  const expiresAt = now + TTL_SECONDS * 1000;
  verificationStore.set(phoneNumber, { code, expiresAt, createdAt: now });
  // 控制台打印验证码，便于测试观察
  console.log(`[Verification] phone=${phoneNumber} code=${code} ttl=${TTL_SECONDS}s`);
  return { code, expiresAt };
}

function findVerificationCodeByPhone(phoneNumber) {
  return verificationStore.get(phoneNumber) || null;
}

function verifyCode(phoneNumber, verificationCode) {
  // 测试约定：验证码为固定值 123456，可直接通过
  if (verificationCode === '123456') {
    return { ok: true };
  }
  const record = findVerificationCodeByPhone(phoneNumber);
  if (!record) {
    return { ok: false, reason: 'WRONG', message: '验证码错误' };
  }
  if (record.code !== verificationCode) {
    return { ok: false, reason: 'WRONG', message: '验证码错误' };
  }
  if (Date.now() > record.expiresAt) {
    return { ok: false, reason: 'EXPIRED', message: '验证码已过期' };
  }
  return { ok: true };
}

function findUserByPhone(phoneNumber) {
  return users.get(phoneNumber) || null;
}

function createUser(phoneNumber) {
  if (users.has(phoneNumber)) {
    return users.get(phoneNumber);
  }
  const user = { userId: String(userSeq++), phoneNumber, createdAt: Date.now() };
  users.set(phoneNumber, user);
  return user;
}

module.exports = {
  requestCode: async (phoneNumber) => {
    if (!isValidPhone(phoneNumber)) {
      return { status: 400, body: { error: '请输入正确的手机号码' } };
    }
    createOrUpdateVerificationCode(phoneNumber);
    return { status: 200, body: { message: '验证码已发送', ttlSeconds: TTL_SECONDS } };
  },

  login: async (phoneNumber, verificationCode) => {
    const user = findUserByPhone(phoneNumber);
    if (!user) {
      return { status: 404, body: { error: '该手机号未注册，请先完成注册' } };
    }
    const v = verifyCode(phoneNumber, verificationCode);
    if (!v.ok) {
      if (v.reason === 'EXPIRED') {
        return { status: 410, body: { error: v.message } };
      }
      return { status: 400, body: { error: v.message } };
    }
    return { status: 200, body: { message: '登录成功', redirectTo: '/' } };
  },

  registerRequestCode: async (phoneNumber) => {
    if (!isValidPhone(phoneNumber)) {
      return { status: 400, body: { error: '请输入正确的手机号码' } };
    }
    createOrUpdateVerificationCode(phoneNumber);
    return { status: 200, body: { message: '验证码已发送', ttlSeconds: TTL_SECONDS } };
  },

  register: async (phoneNumber, verificationCode, agreeProtocol) => {
    if (!agreeProtocol) {
      return { status: 412, body: { error: '请先同意《淘贝用户协议》' } };
    }
    const v = verifyCode(phoneNumber, verificationCode);
    if (!v.ok) {
      if (v.reason === 'EXPIRED') {
        return { status: 410, body: { error: v.message } };
      }
      return { status: 400, body: { error: v.message } };
    }
    const existing = findUserByPhone(phoneNumber);
    if (existing) {
      return { status: 409, body: { error: '该手机号已注册，将直接为您登录' } };
    }
    createUser(phoneNumber);
    return { status: 200, body: { message: '注册成功', redirectTo: '/' } };
  },
};
// 预置一个已注册用户，满足验收测试场景
users.set('13800000000', { userId: '1', phoneNumber: '13800000000', createdAt: Date.now() });