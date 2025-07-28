# 和恋 (Waren) - 前端项目

中日交友恋爱平台的前端应用，基于 Next.js 14 构建。

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 开发环境
```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本
```bash
pnpm build
pnpm start
```

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **表单**: React Hook Form + Zod
- **HTTP 客户端**: Axios
- **实时通信**: Socket.io Client

## 📁 项目结构

```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/             # 可复用组件
├── lib/                    # 工具函数
├── types/                  # TypeScript 类型定义
├── hooks/                  # 自定义 Hooks
└── public/                 # 静态资源
```

## 🔧 环境变量

复制 `.env.example` 到 `.env.local` 并配置：

```bash
cp .env.example .env.local
```

## 📝 开发指南

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码

### 组件开发
- 使用函数组件和 Hooks
- 优先使用 Tailwind CSS 样式
- 保持组件的可复用性

### 状态管理
- 使用 React Context 进行全局状态管理
- 使用 React Query 进行服务端状态管理

## 🚀 部署

### Vercel (推荐)
```bash
pnpm build
```

### Docker
```bash
docker build -t waren-frontend .
docker run -p 3000:3000 waren-frontend
```

## 📞 联系

如有问题，请联系开发团队。 