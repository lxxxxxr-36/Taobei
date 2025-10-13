# 淘贝 (Taobei) - 用户认证系统

一个基于 Node.js + React 的现代化用户认证系统，支持手机号验证码登录和注册。

## 📋 项目结构

```
taobei/
├── backend/          # 后端 API 服务
│   ├── src/         # 源代码
│   └── test/        # 测试文件
├── frontend/        # 前端 React 应用
│   ├── src/         # 源代码
│   └── test/        # 测试文件
├── dist/            # 构建后的前端静态文件
└── .artifacts/      # 接口规格文件
```

## 🚀 快速开始

### 方式一：开发环境运行

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动后端服务**
   ```bash
   npm run start:backend
   ```
   后端服务将在 http://localhost:5173 运行

3. **启动前端开发服务器**
   ```bash
   npm run dev
   ```
   前端应用将在 http://localhost:3000 运行

### 方式二：生产环境部署

1. **构建前端**
   ```bash
   npm run build
   ```
   构建后的文件将生成在 `dist/` 目录

2. **部署静态文件**
   将 `dist/` 目录中的所有文件部署到任何静态文件服务器：
   - **Nginx**: 将文件复制到 nginx 的 web 根目录
   - **Apache**: 将文件复制到 htdocs 目录
   - **云服务**: 上传到 OSS、CDN 等静态托管服务
   - **本地预览**: 使用 `npm run preview` 预览构建结果

3. **启动后端服务**
   ```bash
   npm run start:backend
   ```

## 📦 给其他人使用

### 完整项目包

如果要将整个项目给其他人：

1. **打包项目**
   ```bash
   # 排除 node_modules 和临时文件
   zip -r taobei-project.zip . -x "node_modules/*" "*.log" ".git/*"
   ```

2. **使用说明**
   接收者需要：
   - 安装 Node.js (版本 16+)
   - 运行 `npm install` 安装依赖
   - 按照上述"快速开始"步骤运行

### 仅前端静态文件

如果只需要前端界面：

1. **构建并打包**
   ```bash
   npm run build
   zip -r taobei-frontend.zip dist/
   ```

2. **部署说明**
   接收者可以：
   - 解压到任何 Web 服务器目录
   - 使用 Python: `python -m http.server 8000`
   - 使用 Node.js: `npx serve dist`
   - 直接双击 `index.html` (功能受限)

## 🔧 配置说明

### 后端配置
- 端口: 5173 (可在 `backend/src/app.js` 修改)
- API 路径: `/api/auth/*`

### 前端配置
- 开发端口: 3000
- API 代理: 自动代理 `/api` 到后端服务
- 构建输出: `dist/` 目录

## 📱 功能特性

- ✅ 手机号验证码登录
- ✅ 用户注册
- ✅ 响应式设计
- ✅ 错误处理
- ✅ 加载状态
- ✅ 现代化 UI

## 🧪 测试

```bash
# 运行所有测试
npm test

# 仅运行后端测试
npm run test:backend
```

## 📞 技术支持

如有问题，请检查：
1. Node.js 版本是否为 16+
2. 端口 3000 和 5173 是否被占用
3. 网络连接是否正常

---

**注意**: 生产环境部署时，请确保后端 API 服务正常运行，前端才能正常使用登录注册功能。