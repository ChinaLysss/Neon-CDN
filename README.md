# 🌐 NeonCDN - 现代化自托管CDN解决方案

[English](#-neoncdn---modern-self-hosted-cdn-solution) | [中文](#-neoncdn---现代化自托管cdn解决方案)


## 🌍 多语言README

<details open>
<summary><strong>简体中文</strong></summary>

## 🚀 NeonCDN - 现代化自托管CDN解决方案

[![GitHub stars](https://img.shields.io/github/stars/ChinaLysss/Neon-CDN?style=social)](https://github.com/ChinaLysss/Neon-CDN/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ChinaLysss/Neon-CDN?style=social)](https://github.com/ChinaLysss/Neon-CDN/network)
[![License](https://img.shields.io/github/license/ChinaLysss/Neon-CDN)](https://github.com/ChinaLysss/Neon-CDN/blob/main/LICENSE)

一个轻量级、美观且安全的文件托管解决方案，支持200MB大文件上传和实时预览。

### ✨ 功能特性

- 🖥️ 现代化玻璃拟态UI设计
- 📁 支持文件和文件夹管理
- ⚡ 200MB大文件上传支持
- 🔒 全面的安全防护措施
- 🌈 彩色终端日志输出
- 📱 完全响应式设计
- 🔍 文件预览（图片/文本/HTML）
- 🌐 多语言支持

### 🛠️ 安装步骤

#### 前置要求

- Node.js 16+
- npm 8+
- 500MB以上磁盘空间

#### 1. 克隆仓库

```bash
git clone https://github.com/ChinaLysss/Neon-CDN.git
cd Neon-CDN
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 配置环境（可选）

创建 `.env` 文件：

```env
PORT=3000
CDN_FOLDER=./cdn_files
MAX_FILE_SIZE=209715200 # 200MB in bytes
UPLOAD_LIMIT=10 # 同时上传文件数限制
```

#### 4. 启动服务

```bash
npm start
```

#### 5. 访问界面

打开浏览器访问：[http://localhost:3000](http://localhost:3000)

### 🧰 开发模式

```bash
npm run dev
```

### 🐳 Docker部署

1. 构建镜像：

```bash
docker build -t neon-cdn .
```

2. 运行容器：

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/cdn_files:/app/cdn_files \
  --name neon-cdn \
  neon-cdn
```

### 📂 目录结构

```
Neon-CDN/
├── public/            # 前端静态文件
│   ├── index.html
├── server.js          # 后端主程序
├── package.json       # 项目配置
├── LICENSE            # 开源协议
└── README.md          # 说明文档
```

### 📜 开源协议

本项目采用 [MIT License](https://github.com/ChinaLysss/Neon-CDN/blob/main/LICENSE)

</details>

<details>
<summary><strong>English</strong></summary>

## 🚀 NeonCDN - Modern Self-Hosted CDN Solution

[![GitHub stars](https://img.shields.io/github/stars/ChinaLysss/Neon-CDN?style=social)](https://github.com/ChinaLysss/Neon-CDN/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ChinaLysss/Neon-CDN?style=social)](https://github.com/ChinaLysss/Neon-CDN/network)
[![License](https://img.shields.io/github/license/ChinaLysss/Neon-CDN)](https://github.com/ChinaLysss/Neon-CDN/blob/main/LICENSE)

A lightweight, beautiful and secure file hosting solution with 200MB file upload support and real-time preview.

### ✨ Features

- 🖥️ Modern glassmorphism UI design
- 📁 File and folder management
- ⚡ 200MB large file upload support
- 🔒 Comprehensive security measures
- 🌈 Colorful terminal logging
- 📱 Fully responsive design
- 🔍 File preview (images/text/HTML)
- 🌐 Multi-language support

### 🛠️ Installation

#### Prerequisites

- Node.js 16+
- npm 8+
- 500MB+ disk space

#### 1. Clone repository

```bash
git clone https://github.com/ChinaLysss/Neon-CDN.git
cd Neon-CDN
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment (Optional)

Create `.env` file:

```env
PORT=3000
CDN_FOLDER=./cdn_files
MAX_FILE_SIZE=209715200 # 200MB in bytes
UPLOAD_LIMIT=10 # Concurrent upload limit
```

#### 4. Start service

```bash
npm start
```

#### 5. Access interface

Open browser: [http://localhost:3000](http://localhost:3000)

### 🧰 Development Mode

```bash
npm run dev
```

### 🐳 Docker Deployment

1. Build image:

```bash
docker build -t neon-cdn .
```

2. Run container:

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/cdn_files:/app/cdn_files \
  --name neon-cdn \
  neon-cdn
```

### 📂 Project Structure

```
Neon-CDN/
├── public/            # Frontend files
│   ├── index.html
│   └── assets/        # Static assets
├── server.js          # Backend server
├── package.json       # Project config
├── LICENSE            # License file
└── README.md          # Documentation
```

### 📜 License

This project is licensed under the [MIT License](https://github.com/ChinaLysss/Neon-CDN/blob/main/LICENSE)

</details>

## 🌟 项目亮点

### 技术栈
- **前端**: HTML5, CSS3 (Glassmorphism), JavaScript (ES6+)
- **后端**: Node.js, Express
- **存储**: 文件系统
- **安全**: 路径消毒, 文件类型过滤, 大小限制

### 开发建议
1. 使用VS Code + ESLint + Prettier
2. Chrome/Firefox最新版测试
3. 提交代码前运行 `npm test`

## 🤝 贡献指南

欢迎贡献代码！请遵循以下流程：

1. Fork仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📧 联系方式

- GitHub Issues: [https://github.com/ChinaLysss/Neon-CDN/issues](https://github.com/ChinaLysss/Neon-CDN/issues)
- Email: 1072385033@qq.com

---

<p align="center">
✨ <strong>Happy Hosting!</strong> ✨
</p>
