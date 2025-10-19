# 🚀 快速开始指南

## 本地开发运行

### 方式 1: 开发模式（实时热更新）

```bash
# 安装依赖
pnpm install

# 运行开发服务器
pnpm run dev

# 或使用 entrypoint.sh
./entrypoint.sh development
```

访问 http://localhost:3000

---

## 生产环境运行

### 方式 1: 直接在本地运行（类似 Docker）

```bash
# 第一步：构建应用
./build

# 第二步：启动生产服务器
./entrypoint.sh

# 或者简写
./entrypoint.sh production
```

这是推荐的方式，完全模拟 Docker 中的流程。

---

## Docker 镜像部署

### 方式 1: Docker Compose（最简单，推荐）

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

### 方式 2: 手动 Docker 命令

```bash
# 构建镜像
docker build -t xhs-auth-app:latest .

# 运行容器
docker run -d \
  --name xhs-auth-app \
  -p 3000:3000 \
  xhs-auth-app:latest

# 查看日志
docker logs -f xhs-auth-app
```

---

## 文件说明

| 文件/脚本 | 作用 |
|----------|------|
| `./build` | 构建 Next.js 应用，生成 `.next` 目录 |
| `./entrypoint.sh` | 启动脚本（默认生产环境） |
| `Dockerfile` | Docker 多阶段构建配置 |
| `docker-compose.yml` | Docker Compose 快速启动 |

---

## 工作流程

### 本地开发流程

```
pnpm install
    ↓
pnpm run dev (或 ./entrypoint.sh development)
    ↓
实时热更新
```

### 生产部署流程

```
./build
    ↓
安装依赖 + 构建 Next.js (.next 目录)
    ↓
./entrypoint.sh (或 ./entrypoint.sh production)
    ↓
启动生产服务器（端口 3000）
```

### Docker 部署流程

```
docker build -t xhs-auth-app:latest .
    ↓
Dockerfile 多阶段构建
  - 第一阶段：使用 pnpm run build 构建
  - 第二阶段：复制 .next 和生产依赖
    ↓
docker run xhs-auth-app:latest
    ↓
容器启动时执行 ./entrypoint.sh
    ↓
启动生产服务器
```

---

## 环境变量配置

### 本地开发

`.env.local` 文件：
```bash
NEXT_PUBLIC_API_BASE_URL=https://oyosyatukogk.sealoshzh.site
LICENSE_API_TOKEN=your-token-here
```

### 生产环境

方式 1: 修改 `.env.local`
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-production-domain.com
LICENSE_API_TOKEN=your-production-token
```

方式 2: Docker Compose
编辑 `docker-compose.yml` 中的 `environment` 部分

方式 3: Docker run
```bash
docker run -d \
  -e NEXT_PUBLIC_API_BASE_URL=https://your-domain.com \
  -e LICENSE_API_TOKEN=your-token \
  xhs-auth-app:latest
```

---

## 常见问题

### Q: 执行 ./entrypoint.sh 时说找不到 .next 目录

A: 需要先执行 `./build` 构建应用

```bash
./build
./entrypoint.sh
```

### Q: 镜像构建失败

A: 检查 Docker 日志
```bash
docker build -t xhs-auth-app:latest . 2>&1 | tail -50
```

### Q: 容器启动后立即退出

A: 查看容器日志
```bash
docker logs xhs-auth-app
```

常见原因：
- 依赖安装失败
- 环境变量配置错误
- .next 文件损坏

---

## 性能指标

| 指标 | 值 |
|------|-----|
| 构建时间 | 2-3 分钟 |
| 启动时间 | 2-3 秒 |
| 镜像大小 | 120-150MB |
| 内存占用 | 100-150MB |

---

## 命令参考

### 开发相关

```bash
# 安装依赖
pnpm install

# 运行开发服务器
pnpm run dev

# 检查类型
pnpm run type-check

# 运行 linter
pnpm run lint
```

### 生产相关

```bash
# 完整的生产流程
./build && ./entrypoint.sh

# 或分开执行
./build
./entrypoint.sh

# 指定环境
./entrypoint.sh production  # 生产环境
./entrypoint.sh development # 开发环境
```

### Docker 相关

```bash
# 构建镜像
docker build -t xhs-auth-app:latest .

# 使用 Compose
docker-compose up -d
docker-compose logs -f
docker-compose down

# 清理资源
docker system prune -a
```

---

## 下一步

- 阅读 [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) 了解详细的 Docker 部署信息
- 检查 [.env.example](./.env.example) 了解环境变量配置
- 访问 http://localhost:3000 开始使用应用

