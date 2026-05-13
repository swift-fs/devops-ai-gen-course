# ===== 阶段一：构建 =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# ===== 阶段二：运行 =====
FROM nginx:1.27-alpine

LABEL maintainer="devops-course"
LABEL description="Vue SPA - 根路径部署"

# 删除默认配置
RUN rm -f /etc/nginx/conf.d/default.conf

# 自定义 Nginx 配置：支持 SPA history 路由模式
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
