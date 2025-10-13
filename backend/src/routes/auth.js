const { requestCode, login, registerRequestCode, register } = require('../services/authService');

module.exports = async function authHandler(req, res) {
  const url = new URL(req.url, 'http://localhost');

  // 添加CORS头部
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const sendJson = (status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  };

  // 读取JSON请求体
  const readBody = async () => {
    return await new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => {
        try {
          resolve(JSON.parse(data || '{}'));
        } catch {
          resolve({});
        }
      });
    });
  };

  if (req.method === 'POST' && url.pathname === '/api/auth/request-code') {
    const body = await readBody();
    const result = await requestCode(body.phoneNumber);
    return sendJson(result.status, result.body);
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const body = await readBody();
    const result = await login(body.phoneNumber, body.verificationCode);
    return sendJson(result.status, result.body);
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/register/request-code') {
    const body = await readBody();
    const result = await registerRequestCode(body.phoneNumber);
    return sendJson(result.status, result.body);
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    const body = await readBody();
    const result = await register(body.phoneNumber, body.verificationCode, body.agreeProtocol);
    return sendJson(result.status, result.body);
  }

  return sendJson(404, { error: 'Not Found' });
};