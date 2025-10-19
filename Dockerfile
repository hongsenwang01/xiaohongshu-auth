# 多阶段构建：第一阶段 - 打包构建
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制必要文件
COPY package.json pnpm-lock.yaml ./
COPY build ./build

# 安装依赖和构建
RUN pnpm install --frozen-lockfile && pnpm run build

# 多阶段构建：第二阶段 - 运行时镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 仅安装生产依赖
RUN pnpm install --frozen-lockfile --prod

# 从构建阶段复制构建结果
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

# 复制启动脚本
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

# 暴露端口
EXPOSE 3000

# 环境变量默认值
ENV NODE_ENV=production

# 启动命令
ENTRYPOINT ["./entrypoint.sh"]
