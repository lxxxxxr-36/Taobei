const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 5173;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`后端服务器已启动，运行在 http://localhost:${PORT}`);
  console.log('API 端点:');
  console.log('  POST /api/auth/request-code - 请求登录验证码');
  console.log('  POST /api/auth/login - 用户登录');
  console.log('  POST /api/auth/register/request-code - 请求注册验证码');
  console.log('  POST /api/auth/register - 用户注册');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请检查是否有其他服务正在使用该端口`);
  } else {
    console.error('服务器启动失败:', err);
  }
  process.exit(1);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});