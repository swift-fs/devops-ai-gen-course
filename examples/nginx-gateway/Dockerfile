FROM nginx:1.27-alpine

LABEL maintainer="devops-course"
LABEL description="Nginx 反向代理网关"

# 清除默认配置，使用自定义配置
RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf

# 创建非特权用户
RUN addgroup -S nginx-app && adduser -S nginx-app -G nginx-app

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
