# Docker 部署指南

## 快速开始

### 方式 1: 使用 Docker Compose（推荐）

```bash
# 构建并启动镜像
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止容器
docker-compose down
```

### 方式 2: 手动 Docker 构建

```bash
# 第一步：构建镜像
docker build -t xhs-auth-app:latest .

# 第二步：运行容器
docker run -d \
  --name xhs-auth-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com \
  xhs-auth-app:latest

# 查看容器日志
docker logs -f xhs-auth-app
```

## 工作流程说明

### Next.js 构建工作流

```
entrypoint.sh (启动脚本)
    ↓
检查构建文件 (.next 目录)
    ↓
直接启动应用 (pnpm run start)
```

### Docker 多阶段构建流程

```
Dockerfile (多阶段构建)
    ↓
第一阶段 (builder)：构建 Next.js
  - 安装所有依赖 (包括开发依赖)
  - 运行构建命令
  - 生成 .next 目录
    ↓
第二阶段 (runtime)：运行应用
  - 仅安装生产依赖
  - 复制构建产物 (.next, public, next.config.mjs)
  - 复制 entrypoint.sh
  - 启动生产服务器
```

## 为什么这样做？

### ✅ 分离打包和运行的好处

1. **避免循环启动** - 不会每次启动都重新构建
2. **快速启动** - 容器启动时只需启动应用，不需要等待构建
3. **镜像优化** - 最终镜像只包含生产依赖，大小更小
4. **类似 Spring Boot** - 就像 Spring Boot 的 fat jar，所有东西都打包好了

### 镜像大小对比

```
未优化的方式：400MB+  (包含所有开发依赖)
优化后的方式：120-150MB  (仅包含生产依赖)
```

## 配置环境变量

### 在 docker-compose 中配置

编辑 `docker-compose.yml`:
```yaml
environment:
  - NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
  - LICENSE_API_TOKEN=your-token-here
```

### 在 docker run 中配置

```bash
docker run -d \
  -e NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com \
  -e LICENSE_API_TOKEN=your-token-here \
  xhs-auth-app:latest
```

### 从 .env 文件配置

```bash
docker run -d \
  --env-file .env.production \
  xhs-auth-app:latest
```

## 故障排查

### 问题 1: 容器启动失败

```bash
# 查看日志
docker logs xhs-auth-app

# 常见原因：API 地址配置错误或网络连接问题
```

### 问题 2: 端口已被占用

```bash
# 使用不同的端口
docker run -d -p 8080:3000 xhs-auth-app:latest

# 或停止占用端口的容器
docker ps
docker stop <container-id>
```

### 问题 3: 健康检查失败

容器启动后 40 秒内如果无法响应 HTTP 请求，健康检查会失败

```bash
# 查看健康状态
docker ps

# 检查应用是否正常运行
curl http://localhost:3000
```

## 生产部署建议

### 1. 使用专用数据卷

```bash
docker run -d \
  -v /data/logs:/app/logs \
  -p 3000:3000 \
  xhs-auth-app:latest
```

### 2. 使用环境配置文件

```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
LICENSE_API_TOKEN=your-production-token

docker run -d \
  --env-file .env.production \
  -p 3000:3000 \
  xhs-auth-app:latest
```

### 3. 使用反向代理（Nginx）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 参考命令

```bash
# 构建镜像
docker build -t xhs-auth-app:latest .

# 标记镜像为发布版本
docker tag xhs-auth-app:latest xhs-auth-app:v1.0.0

# 查看镜像大小
docker images xhs-auth-app

# 清理未使用的镜像
docker image prune

# 完整清理（谨慎使用）
docker system prune -a
```
