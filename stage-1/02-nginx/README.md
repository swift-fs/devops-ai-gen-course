# Nginx 从入门到进阶完整教程

> 适用版本：Nginx 1.27.x（主线版本）/ Nginx 1.26.x（稳定版本）  
> 最后更新：2026-05

---

## 目录

- [第一部分：Nginx 基础](#第一部分nginx-基础)
  - [1.1 什么是 Nginx](#11-什么是-nginx)
  - [1.2 安装 Nginx](#12-安装-nginx)
  - [1.3 配置文件结构](#13-配置文件结构)
  - [1.4 基础命令](#14-基础命令)
- [第二部分：核心功能](#第二部分核心功能)
  - [2.1 静态文件服务](#21-静态文件服务)
  - [2.2 反向代理](#22-反向代理)
  - [2.3 负载均衡](#23-负载均衡)
  - [2.4 SSL/HTTPS 配置](#24-sslhttps-配置)
  - [2.5 虚拟主机](#25-虚拟主机)
- [第三部分：进阶功能](#第三部分进阶功能)
  - [3.1 URL 重写与跳转](#31-url-重写与跳转)
  - [3.2 Gzip 压缩](#32-gzip-压缩)
  - [3.3 缓存配置](#33-缓存配置)
  - [3.4 访问控制](#34-访问控制)
  - [3.5 日志管理](#35-日志管理)
  - [3.6 限流与限速](#36-限流与限速)
- [第四部分：Docker 部署 Nginx](#第四部分docker-部署-nginx)
- [参考链接](#参考链接)

---

## 第一部分：Nginx 基础

### 1.1 什么是 Nginx

Nginx（读作 "engine-x"）是一个高性能的开源软件，主要用途：

| 用途 | 说明 |
|------|------|
| **Web 服务器** | 处理静态文件（HTML、CSS、JS、图片） |
| **反向代理** | 将请求转发给后端应用服务器 |
| **负载均衡** | 在多个后端服务器之间分发流量 |
| **邮件代理** | IMAP/POP3/SMTP 代理（较少用） |
| **API 网关** | 路由、认证、限流等 |

**Nginx vs Apache 对比：**

```
Nginx（事件驱动）：
一个 Worker 进程可以同时处理数千个连接
┌──────────────┐
│  Worker 进程  │──处理──▶ 连接1, 连接2, 连接3, ... 连接N
└──────────────┘

Apache（进程/线程驱动）：
每个连接需要一个独立的线程/进程
┌──────────────┐
│  线程1        │──处理──▶ 连接1
├──────────────┤
│  线程2        │──处理──▶ 连接2
├──────────────┤
│  线程3        │──处理──▶ 连接3
└──────────────┘
```

### 1.2 安装 Nginx

#### 方式一：Docker 部署（推荐 ✅）

```bash
# 最简单的方式：一行命令运行 Nginx
docker run -d \
  --name my-nginx \
  -p 80:80 \
  -v ./html:/usr/share/nginx/html:ro \
  nginx:1.27-alpine

# 带自定义配置运行
docker run -d \
  --name my-nginx \
  -p 80:80 \
  -p 443:443 \
  -v ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v ./nginx/conf.d:/etc/nginx/conf.d:ro \
  -v ./html:/usr/share/nginx/html:ro \
  -v ./certs:/etc/nginx/certs:ro \
  -v nginx-logs:/var/log/nginx \
  nginx:1.27-alpine
```

**使用 Docker Compose（推荐）：**

```yaml
# compose.yaml
services:
  nginx:
    image: nginx:1.27-alpine
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./conf.d:/etc/nginx/conf.d:ro
      - ./html:/usr/share/nginx/html:ro
      - ./certs:/etc/nginx/certs:ro
      - nginx-logs:/var/log/nginx
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3

volumes:
  nginx-logs:
```

#### 方式二：Debian/Ubuntu 系统安装

```bash
# 安装 Nginx
sudo apt-get update
sudo apt-get install -y nginx

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx

# 验证版本
nginx -v
# 输出：nginx version: nginx/1.26.x
```

#### 方式三：安装最新主线版本

```bash
# 添加 Nginx 官方仓库（获取最新版本）
sudo apt-get install -y curl gnupg2 ca-certificates lsb-release
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
  | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg > /dev/null

# 主线版本（最新功能）
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
  http://nginx.org/packages/mainline/debian `lsb_release -cs` nginx" \
  | sudo tee /etc/apt/sources.list.d/nginx.list

# 安装
sudo apt-get update
sudo apt-get install -y nginx
```

### 1.3 配置文件结构

Nginx 的配置文件采用嵌套块状结构，层级关系如下：

```
/etc/nginx/
├── nginx.conf              # 主配置文件
├── conf.d/                 # 虚拟主机配置目录（推荐在此添加配置）
│   ├── default.conf
│   ├── site-a.conf
│   └── site-b.conf
├── sites-available/        # 可用的站点配置（Debian/Ubuntu 特有）
├── sites-enabled/          # 已启用的站点配置（符号链接）
├── snippets/               # 可复用的配置片段
└── modules-enabled/        # 动态模块配置
```

**主配置文件 `nginx.conf` 结构：**

```nginx
# ===== 全局块：影响 Nginx 整体运行的配置 =====
user  nginx;                          # 运行用户
worker_processes  auto;               # Worker 进程数（auto = CPU 核心数）
error_log  /var/log/nginx/error.log warn;  # 错误日志路径和级别
pid        /var/run/nginx.pid;        # 进程 ID 文件

# ===== 事件块：影响网络连接的处理 =====
events {
    worker_connections  1024;         # 每个 Worker 的最大连接数
    # accept_mutex on;                # 是否启用连接互斥锁（高负载时关闭）
    # multi_accept on;                # 是否一次性接受所有连接
}

# ===== HTTP 块：HTTP 服务相关配置 =====
http {
    include       /etc/nginx/mime.types;       # 文件类型映射
    default_type  application/octet-stream;     # 默认文件类型

    # 日志格式定义
    log_format  main  '$remote_addr - $remote_user [$time_local] '
                      '"$request" $status $body_bytes_sent '
                      '"$http_referer" "$http_user_agent"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;                # 启用零拷贝传输
    # tcp_nopush     on;               # 优化数据包发送
    # tcp_nodelay    on;               # 禁用 Nagle 算法（低延迟）
    keepalive_timeout  65;             # 长连接超时时间

    # Gzip 压缩
    gzip  on;

    # 包含其他配置文件
    include /etc/nginx/conf.d/*.conf;

    # ===== server 块：虚拟主机配置 =====
    server {
        listen       80;              # 监听端口
        server_name  localhost;       # 域名

        # ===== location 块：URL 路由匹配 =====
        location / {
            root   /usr/share/nginx/html;  # 网站根目录
            index  index.html index.htm;   # 默认首页
        }

        # 错误页面
        error_page  404              /404.html;
        error_page  500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
}
```

**配置层级关系图：**

```
main（全局）
├── events（事件）
└── http（HTTP 服务）
    ├── upstream（上游服务器组）
    ├── server（虚拟主机）
    │   ├── location（URL 路由）
    │   │   ├── proxy_pass（代理转发）
    │   │   └── ...
    │   └── ...
    └── ...
```

### 1.4 基础命令

```bash
# 启动 Nginx
nginx
# 或
sudo systemctl start nginx

# 停止 Nginx
nginx -s stop       # 快速停止
nginx -s quit       # 优雅停止（处理完当前请求再停止）

# 重新加载配置（不中断服务，生产环境必用）
nginx -s reload
# 或
sudo systemctl reload nginx

# 测试配置文件语法（修改配置后务必先测试）
nginx -t
# 输出：
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# 查看配置文件路径
nginx -t    # 输出中包含配置文件路径

# 查看 Nginx 版本
nginx -v    # 版本号
nginx -V    # 版本号 + 编译参数（查看已安装模块）

# Docker 容器中的 Nginx 命令
docker exec my-nginx nginx -t              # 测试配置
docker exec my-nginx nginx -s reload       # 重新加载
docker exec my-nginx nginx -v              # 查看版本
```

---

## 第二部分：核心功能

### 2.1 静态文件服务

Nginx 最基本的功能是提供静态文件服务。

```nginx
server {
    listen 80;
    server_name example.com;

    # 网站根目录
    root /var/www/html;
    index index.html index.htm;

    # 主页
    location / {
        try_files $uri $uri/ =404;    # 尝试按顺序查找文件
    }

    # 静态资源缓存（图片、CSS、JS）
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff2)$ {
        expires 30d;                          # 浏览器缓存 30 天
        add_header Cache-Control "public, no-transform";
        access_log off;                        # 静态资源不记录日志
    }

    # 禁止访问隐藏文件（如 .git）
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

**`try_files` 的常见用法：**

```nginx
# SPA（单页应用）支持：所有路径都返回 index.html，由前端路由处理
location / {
    try_files $uri $uri/ /index.html;
}

# 先找文件，再找目录，最后代理到后端
location / {
    try_files $uri $uri/ @backend;
}

location @backend {
    proxy_pass http://backend-server;
}
```

### 2.2 反向代理

反向代理是 Nginx 最常用的功能——客户端请求 Nginx，Nginx 再将请求转发给后端服务器。

```
客户端 ──▶ Nginx（反向代理）──▶ 后端服务器
          example.com:80        192.168.1.10:8080
```

#### 基础反向代理

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;      # 后端服务地址

        # 传递客户端真实信息（重要！）
        proxy_set_header Host              $host;           # 原始域名
        proxy_set_header X-Real-IP         $remote_addr;    # 客户端真实 IP
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;  # 代理链
        proxy_set_header X-Forwarded-Proto $scheme;         # 原始协议（http/https）
    }
}
```

#### 完整的反向代理配置（含 WebSocket 支持）

```nginx
server {
    listen 80;
    server_name app.example.com;

    # 反向代理到 Node.js 应用
    location / {
        proxy_pass http://127.0.0.1:3000;

        # 基本代理头
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持（Socket.io、ws 等）
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 超时设置
        proxy_connect_timeout 60s;    # 连接后端超时
        proxy_send_timeout    60s;    # 发送请求超时
        proxy_read_timeout    60s;    # 读取响应超时

        # 缓冲设置
        proxy_buffering on;           # 启用缓冲
        proxy_buffer_size 4k;         # 响应头缓冲
        proxy_buffers 8 4k;           # 响应体缓冲
    }
}
```

#### 多路径代理到不同后端

```nginx
server {
    listen 80;
    server_name example.com;

    # API 请求转发到后端 API 服务
    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        # 注意：/api/ 末尾有斜杠，proxy_pass 末尾也有斜杠
        # 效果：/api/users → http://127.0.0.1:8080/users（去掉了 /api 前缀）

        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    }

    # WebSocket 转发
    location /ws/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 其他请求转发到前端服务
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }
}
```

### 2.3 负载均衡

Nginx 可以将流量分发到多个后端服务器，提高可用性和性能。

```
                    ┌─▶ 后端服务器1 (192.168.1.10:8080)
客户端 ──▶ Nginx ───┼─▶ 后端服务器2 (192.168.1.11:8080)
                    └─▶ 后端服务器3 (192.168.1.12:8080)
```

#### 负载均衡策略

```nginx
# 定义后端服务器组
upstream backend {
    # ===== 负载均衡策略（选一种） =====

    # 1. 轮询（默认）- 依次分配
    server 192.168.1.10:8080;
    server 192.168.1.11:8080;
    server 192.168.1.12:8080;

    # 2. 加权轮询 - 性能强的服务器分配更多流量
    # server 192.168.1.10:8080 weight=3;   # 权重 3，分配 3/5 的流量
    # server 192.168.1.11:8080 weight=2;   # 权重 2，分配 2/5 的流量

    # 3. 最少连接 - 将请求发给当前连接数最少的服务器
    # least_conn;
    # server 192.168.1.10:8080;
    # server 192.168.1.11:8080;

    # 4. IP 哈希 - 同一客户端 IP 始终访问同一服务器（会话保持）
    # ip_hash;
    # server 192.168.1.10:8080;
    # server 192.168.1.11:8080;

    # 5. 通用哈希（可基于任意变量）
    # hash $request_uri consistent;        # 基于 URL 哈希（缓存友好）
    # server 192.168.1.10:8080;
    # server 192.168.1.11:8080;

    # 备用服务器（只在其他服务器都不可用时使用）
    # server 192.168.1.20:8080 backup;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://backend;      # 引用 upstream 组
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    }
}
```

#### 健康检查

```nginx
upstream backend {
    server 192.168.1.10:8080 max_fails=3 fail_timeout=30s;
    server 192.168.1.11:8080 max_fails=3 fail_timeout=30s;

    # max_fails: 在 fail_timeout 时间内失败次数达到此值，标记为不可用
    # fail_timeout: 标记为不可用后，等待这么长时间再尝试
}

server {
    listen 80;

    location / {
        proxy_pass http://backend;

        # 主动健康检查（需要 nginx-plus 或第三方模块）
        # 开源版使用被动的 max_fails 机制
        proxy_next_upstream error timeout http_502 http_503 http_504;
        # 当遇到这些错误时，自动尝试下一个后端
    }
}
```

### 2.4 SSL/HTTPS 配置

#### 使用 Let's Encrypt 免费证书（推荐）

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 自动获取并配置证书（交互式）
sudo certbot --nginx -d example.com -d www.example.com

# 自动续期（Certbot 会自动添加定时任务）
sudo certbot renew --dry-run    # 测试续期
```

#### 手动配置 SSL

```nginx
server {
    # HTTP 重定向到 HTTPS
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;    # 301 永久重定向
}

server {
    listen 443 ssl;
    server_name example.com www.example.com;

    # SSL 证书路径
    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    # SSL 协议版本（推荐配置）
    ssl_protocols TLSv1.2 TLSv1.3;

    # 加密套件（推荐）
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:
                ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

    # 优先使用服务器端的加密套件
    ssl_prefer_server_ciphers on;

    # SSL 会话缓存（减少重复握手）
    ssl_session_cache shared:SSL:10m;     # 10MB 缓存，约 4 万个会话
    ssl_session_timeout 10m;              # 会话超时 10 分钟

    # OCSP Stapling（加速证书验证）
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # HSTS（强制浏览器使用 HTTPS）
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 网站配置
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

### 2.5 虚拟主机

一台 Nginx 服务器可以同时服务多个网站（域名）。

```nginx
# ===== 网站 A：静态站点 =====
server {
    listen 80;
    server_name site-a.com www.site-a.com;

    root /var/www/site-a;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    access_log /var/log/nginx/site-a.access.log;
    error_log  /var/log/nginx/site-a.error.log;
}

# ===== 网站 B：反向代理 =====
server {
    listen 80;
    server_name site-b.com www.site-b.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    access_log /var/log/nginx/site-b.access.log;
    error_log  /var/log/nginx/site-b.error.log;
}

# ===== 网站 C：带 SSL =====
server {
    listen 443 ssl;
    server_name site-c.com;

    ssl_certificate     /etc/nginx/certs/site-c/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/site-c/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

---

## 第三部分：进阶功能

### 3.1 URL 重写与跳转

```nginx
server {
    listen 80;
    server_name example.com;

    # 301 永久重定向（搜索引擎会更新索引）
    # 适合：域名更换、URL 结构变更
    return 301 https://$host$request_uri;

    # rewrite 指令：基于正则的 URL 重写
    # 语法：rewrite 正则 替换 [flag]

    # 将 /old-page 永久重定向到 /new-page
    rewrite ^/old-page$ /new-page permanent;

    # 将 /user/123 重写为 /profile?id=123
    rewrite ^/user/(\d+)$ /profile?id=$1 last;

    # 将所有 /blog/ 请求重写到新的博客系统
    rewrite ^/blog/(.*)$ /articles/$1 last;

    # HTTP 强制跳转 HTTPS
    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }

    # flag 说明：
    # last      - 重写后重新搜索 location（最常用）
    # break     - 重写后不再搜索 location
    # redirect  - 返回 302 临时重定向
    # permanent - 返回 301 永久重定向
}
```

### 3.2 Gzip 压缩

```nginx
http {
    # 启用 Gzip 压缩
    gzip on;

    # 压缩级别（1-9，1 最快压缩率最低，9 最慢压缩率最高，推荐 4-6）
    gzip_comp_level 6;

    # 最小压缩阈值（小于此大小的响应不压缩）
    gzip_min_length 256;

    # 压缩的 MIME 类型
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        application/rss+xml
        image/svg+xml
        font/woff2;

    # 是否在代理场景下压缩（推荐开启）
    gzip_proxied any;

    # 添加 Vary: Accept-Encoding 头
    gzip_vary on;

    # 禁用对 IE6 的压缩（已过时的浏览器兼容）
    gzip_disable "msie6";
}
```

### 3.3 缓存配置

#### 浏览器缓存

```nginx
server {
    # 静态资源长期缓存
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 1y;                                    # 缓存 1 年
        add_header Cache-Control "public, immutable";  # immutable 避免重新验证
        access_log off;
    }

    # CSS/JS 中期缓存
    location ~* \.(css|js)$ {
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    # HTML 短期缓存或不缓存
    location ~* \.html$ {
        expires -1;                                     # 不缓存
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # 字体文件长期缓存
    location ~* \.(woff|woff2|ttf|otf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
```

#### Nginx 代理缓存（缓存后端响应）

```nginx
http {
    # 定义缓存路径和参数
    # keys_zone=名称:大小  max_size=最大磁盘空间  inactive=多久未访问则删除
    proxy_cache_path /var/cache/nginx/proxy
                     levels=1:2
                     keys_zone=api_cache:10m
                     max_size=1g
                     inactive=60m
                     use_temp_path=off;

    server {
        location /api/ {
            proxy_pass http://backend;
            proxy_cache api_cache;                      # 使用上面定义的缓存区

            # 缓存的有效时间（按状态码分别设置）
            proxy_cache_valid 200    10m;               # 200 响应缓存 10 分钟
            proxy_cache_valid 404     1m;               # 404 响应缓存 1 分钟
            proxy_cache_valid any      5m;              # 其他响应缓存 5 分钟

            # 缓存 key 的定义
            proxy_cache_key "$scheme$request_method$host$request_uri";

            # 添加缓存状态头（调试用）
            add_header X-Cache-Status $upstream_cache_status;
            # HIT: 命中缓存    MISS: 未命中    EXPIRED: 过期    STALE: 过期但仍在使用

            # 当后端故障时，使用过期的缓存（保障可用性）
            proxy_cache_use_stale error timeout updating http_500 http_502 http_503;

            # 防止缓存风暴（同时只允许一个请求更新缓存）
            proxy_cache_lock on;
        }
    }
}
```

### 3.4 访问控制

```nginx
server {
    # 基于 IP 的访问控制
    location /admin/ {
        allow 192.168.1.0/24;      # 允许内网访问
        allow 10.0.0.0/8;          # 允许 VPN 网络
        deny all;                   # 拒绝其他所有 IP
    }

    # 基于密码的访问控制（HTTP Basic Auth）
    location /private/ {
        auth_basic "需要登录";                    # 提示信息
        auth_basic_user_file /etc/nginx/.htpasswd;  # 密码文件

        proxy_pass http://backend;
    }

    # 完全拒绝访问某些文件类型
    location ~* \.(env|git|svn|bak|sql|log)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

**创建密码文件：**

```bash
# 安装 apache2-utils（提供 htpasswd 命令）
sudo apt-get install -y apache2-utils

# 创建密码文件并添加用户（首次用 -c 创建）
sudo htpasswd -c /etc/nginx/.htpasswd admin
# 输入两次密码

# 添加更多用户（不要用 -c，否则会覆盖）
sudo htpasswd /etc/nginx/.htpasswd user2
```

### 3.5 日志管理

```nginx
http {
    # 自定义日志格式
    log_format  detailed  '$remote_addr - $remote_user [$time_local] '
                          '"$request" $status $body_bytes_sent '
                          '"$http_referer" "$http_user_agent" '
                          '$request_time $upstream_response_time';
    # $request_time: 请求总耗时
    # $upstream_response_time: 后端响应耗时

    # 使用自定义格式
    access_log  /var/log/nginx/access.log  detailed;

    # 按条件记录日志（例如只记录错误请求）
    map $status $loggable {
        ~^[23]  0;    # 2xx 和 3xx 不记录
        default 1;    # 其他（4xx, 5xx）记录
    }

    # server 块中：
    # access_log /var/log/nginx/error-requests.log detailed if=$loggable;

    # 完全关闭日志（静态资源等）
    # access_log off;
}
```

**日志轮转配置（`/etc/logrotate.d/nginx`）：**

```bash
/var/log/nginx/*.log {
    daily                   # 每天轮转
    missingok              # 日志不存在不报错
    rotate 30              # 保留 30 天
    compress               # 压缩旧日志
    delaycompress          # 延迟一次压缩
    notifempty             # 空日志不轮转
    create 0640 nginx adm  # 创建新日志的权限
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 $(cat /var/run/nginx.pid)
    endpostrotate
}
```

### 3.6 限流与限速

```nginx
http {
    # 限流区域定义（基于客户端 IP）
    # rate=10r/s 表示每秒最多 10 个请求
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

    # 连接数限制（同一 IP 最多同时 20 个连接）
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    server {
        # API 限流
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            # burst=20: 允许突发 20 个请求排队
            # nodelay: 突发请求不延迟处理

            limit_conn conn_limit 20;     # 每个 IP 最多 20 个并发连接

            # 超出限制时返回 429（而非默认的 503）
            limit_req_status 429;

            proxy_pass http://backend;
        }

        # 下载限速
        location /downloads/ {
            limit_rate 500k;              # 限制下载速度 500KB/s
            limit_rate_after 10m;         # 前 10MB 不限速

            alias /var/www/downloads/;
        }
    }
}
```

---

## 第四部分：Docker 部署 Nginx

### 完整的多站点 Docker 部署方案

**目录结构：**

```
nginx-docker/
├── compose.yaml
├── nginx/
│   └── nginx.conf
├── conf.d/
│   ├── site-a.conf
│   └── site-b.conf
├── html/
│   └── site-a/
│       └── index.html
├── certs/
│   └── (SSL 证书文件)
└── .env
```

**compose.yaml：**

```yaml
services:
  nginx:
    image: nginx:1.27-alpine
    container_name: nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./conf.d:/etc/nginx/conf.d:ro
      - ./html:/usr/share/nginx/html:ro
      - ./certs:/etc/nginx/certs:ro
      - nginx-logs:/var/log/nginx
    environment:
      - TZ=Asia/Shanghai
    depends_on:
      - webapp-a
      - webapp-b
    networks:
      - web-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3

  # 后端服务 A
  webapp-a:
    image: node:20-alpine
    container_name: webapp-a
    working_dir: /app
    command: node server.js
    volumes:
      - ./apps/webapp-a:/app
    networks:
      - web-network
    restart: unless-stopped

  # 后端服务 B
  webapp-b:
    image: python:3.12-slim
    container_name: webapp-b
    working_dir: /app
    command: python app.py
    volumes:
      - ./apps/webapp-b:/app
    networks:
      - web-network
    restart: unless-stopped

volumes:
  nginx-logs:

networks:
  web-network:
```

**nginx/nginx.conf：**

```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] '
                      '"$request" $status $body_bytes_sent '
                      '"$http_referer" "$http_user_agent"';

    access_log  /var/log/nginx/access.log  main;

    sendfile    on;
    tcp_nopush  on;
    tcp_nodelay on;

    keepalive_timeout  65;

    # Gzip 压缩
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types text/plain text/css application/javascript application/json;

    # 包含虚拟主机配置
    include /etc/nginx/conf.d/*.conf;
}
```

**conf.d/site-a.conf：**

```nginx
server {
    listen 80;
    server_name site-a.local;

    root /usr/share/nginx/html/site-a;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

**conf.d/site-b.conf：**

```nginx
server {
    listen 80;
    server_name site-b.local;

    location / {
        proxy_pass http://webapp-b:5000;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    }
}
```

```bash
# 启动所有服务
docker compose up -d

# 测试配置
docker exec nginx-proxy nginx -t

# 重新加载配置（不中断服务）
docker exec nginx-proxy nginx -s reload

# 查看日志
docker compose logs -f nginx
```

---

## 参考链接

- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Nginx Docker 镜像](https://hub.docker.com/_/nginx)
- [Let's Encrypt 官网](https://letsencrypt.org/)
- [Nginx 速查表](https://wangchujiang.com/reference/nginx.html)
- [Mozilla SSL 配置生成器](https://ssl-config.mozilla.org/)
