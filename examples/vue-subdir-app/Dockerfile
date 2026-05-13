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
LABEL description="Vue SPA - 二级目录部署 (网关 /vue-sub/ 路径)"

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
