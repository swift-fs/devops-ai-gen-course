# ===== 阶段一：安装依赖 =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# ===== 阶段二：运行 =====
FROM node:20-alpine

LABEL maintainer="devops-course"
LABEL description="Node.js API 服务 (Express)"

WORKDIR /app

# 创建非特权用户
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup

# 从构建阶段复制依赖和源码
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# 修改文件所有者
RUN chown -R nodeuser:nodegroup /app

USER nodeuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.js"]
