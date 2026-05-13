# ===== 阶段一：构建（当前项目为纯静态站点，构建阶段预留扩展） =====
FROM public.ecr.aws/docker/library/nginx:1.27-alpine AS builder

# 将静态文件复制到构建阶段的临时目录
COPY index.html /tmp/site/index.html
COPY stage-1/   /tmp/site/stage-1/

# ===== 阶段二：运行时 =====
FROM public.ecr.aws/docker/library/nginx:1.27-alpine

LABEL maintainer="devops-course"
LABEL description="DevOps 运维课程静态网站"

# 替换默认 Nginx 配置为自定义配置
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# 从构建阶段复制静态文件到 Nginx 默认服务目录
COPY --from=builder /tmp/site/ /usr/share/nginx/html/

# 创建非特权用户运行 Nginx
RUN addgroup -S nginx-app && \
    adduser -S -G nginx-app nginx-app && \
    chown -R nginx-app:nginx-app /usr/share/nginx/html && \
    chown -R nginx-app:nginx-app /var/cache/nginx && \
    chown -R nginx-app:nginx-app /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx-app:nginx-app /var/run/nginx.pid

# 使用非 root 用户运行
USER nginx-app

# 健康检查：每 30 秒探测一次 /health 端点
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
