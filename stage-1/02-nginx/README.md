# Nginx 从入门到进阶完整教程

> 适用版本：Nginx 1.27.x（主线版本）/ Nginx 1.26.x（稳定版本）  
> 最后更新：2026-05

---

## 学习目标

完成本教程后，你将能够：

- ✅ 理解 Nginx 的事件驱动架构及其与 Apache 的核心区别
- ✅ 独立安装 Nginx 并理解配置文件的层级结构（http → server → location）
- ✅ 配置静态文件服务、反向代理、负载均衡和 SSL/HTTPS
- ✅ 使用 Let's Encrypt + lego 自动获取和管理免费 SSL 证书
- ✅ 使用 Docker 容器化部署 Nginx，实现多站点管理
- ✅ 掌握 Gzip 压缩、缓存策略、限流等性能优化手段
- ✅ 排查 Nginx 常见问题（502/504 错误、配置语法错误、性能瓶颈）

## 前置条件

| 条件        | 说明                          | 必要性 |
| ----------- | ----------------------------- | ------ |
| Linux 基础  | 熟悉命令行操作和文本编辑      | 必需   |
| 网络基础    | 了解 HTTP 协议、DNS、端口概念 | 必需   |
| Docker 基础 | 了解容器基本操作              | 推荐   |
| 域名与 SSL  | 了解域名解析和 HTTPS 基本概念 | 有帮助 |

> 💡 **没有 Docker 基础？** 建议先完成本课程的 [Docker 入门到进阶](../01-docker/README.md) 章节。

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
- [第五部分：常见操作指南（How-to）](#第五部分常见操作指南how-to)
- [第六部分：配置速查表（Reference）](#第六部分配置速查表reference)
- [第七部分：故障排除](#第七部分故障排除)
- [总结与下一步](#总结与下一步)
- [参考链接](#参考链接)

---

## 第一部分：Nginx 基础

### 1.1 什么是 Nginx

Nginx（读作 "engine-x"）是一个高性能的开源软件，主要用途：

| 用途           | 说明                                |
| -------------- | ----------------------------------- |
| **Web 服务器** | 处理静态文件（HTML、CSS、JS、图片） |
| **反向代理**   | 将请求转发给后端应用服务器          |
| **负载均衡**   | 在多个后端服务器之间分发流量        |
| **邮件代理**   | IMAP/POP3/SMTP 代理（较少用）       |
| **API 网关**   | 路由、认证、限流等                  |

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

#### 背景知识：为什么需要 HTTPS？

在互联网上，数据以明文形式传输是非常危险的。HTTPS 通过加密来保护数据安全。

```
HTTP（不安全）：
浏览器 ──明文──▶ 网络 ──明文──▶ 服务器
        任何中间人都能看到你传输的密码、银行卡号等

HTTPS（安全）：
浏览器 ──加密数据──▶ 网络 ──加密数据──▶ 服务器
        中间人只能看到乱码，无法窃取内容
```

**HTTPS 的三个核心作用：**

| 作用         | 说明                                     |
| ------------ | ---------------------------------------- |
| **加密**     | 数据传输时加密，防止被窃听               |
| **身份验证** | 确认你连接的是真正的服务器，防止钓鱼网站 |
| **完整性**   | 确保数据在传输过程中没有被篡改           |

**要实现 HTTPS，你需要一个 SSL/TLS 证书。** 证书就像网站的"身份证"，由权威机构（CA，Certificate Authority）签发。

#### 什么是 Let's Encrypt？

**Let's Encrypt** 是一个**免费的、自动化的**证书颁发机构（CA），由非营利组织 ISRG 运营。

| 对比项     | 传统 CA（如 DigiCert） | Let's Encrypt                |
| ---------- | ---------------------- | ---------------------------- |
| 价格       | 每年几十到几千元       | **完全免费**                 |
| 有效期     | 1-2 年                 | **90 天**（但可自动续期）    |
| 申请方式   | 手动提交材料、人工审核 | **全自动**（通过 ACME 协议） |
| 通配符证书 | 通常需付费             | **支持**（通过 DNS 验证）    |

> 💡 **90 天有效期不是缺点！** 短有效期 + 自动续期 = 更安全。即使私钥泄露，影响时间也很短。

#### 什么是 ACME 协议？

**ACME**（Automatic Certificate Management Environment）是 Let's Encrypt 设计的自动化证书管理协议（标准编号：RFC 8555）。

简单来说，ACME 协议定义了你的服务器如何**自动**向 Let's Encrypt 证明"我确实拥有这个域名"，然后自动获取和续期证书。

```
ACME 工作流程（简化版）：

  你的服务器                          Let's Encrypt
      │                                    │
      │  1. "我想申请 example.com 的证书"    │
      │ ──────────────────────────────────▶ │
      │                                    │
      │  2. "好的，请在你的网站上放一个       │
      │     特殊文件来证明你拥有这个域名"      │
      │ ◀────────────────────────────────── │
      │                                    │
      │  3. （你放置验证文件）                │
      │                                    │
      │  4. "验证文件已放好，请检查"           │
      │ ──────────────────────────────────▶ │
      │                                    │
      │  5. （Let's Encrypt 检查验证文件）     │
      │                                    │
      │  6. "验证通过！这是你的证书"           │
      │ ◀────────────────────────────────── │
```

要使用 ACME 协议，你需要一个 **ACME 客户端**软件。常见的有：

| 客户端      | 语言   | 特点                                              |
| ----------- | ------ | ------------------------------------------------- |
| **Certbot** | Python | 最知名，由 EFF 开发，有 Nginx/Apache 自动集成插件 |
| **lego**    | Go     | 轻量、无依赖、支持 180+ DNS 服务商、Docker 友好   |
| **acme.sh** | Shell  | 纯 Shell 实现，适合嵌入式设备                     |

> 本教程使用 **lego**，因为它是 Go 编写的单文件二进制，无需安装运行时环境，且对 Docker 部署非常友好。

#### 安装 lego

##### 方式一：直接下载二进制文件（推荐 ✅）

```bash
# 第 1 步：查看你的系统架构
# 大多数云服务器是 linux-amd64
# 树莓派等 ARM 设备是 linux-arm64
uname -m
# x86_64 → amd64
# aarch64 → arm64

# 第 2 步：下载 lego（以 linux-amd64 为例）
# 访问 https://github.com/go-acme/lego/releases 查看最新版本
curl -L -o lego.tar.gz https://github.com/go-acme/lego/releases/download/v4.22.1/lego_v4.22.1_linux_amd64.tar.gz

# 第 3 步：解压
tar xzf lego.tar.gz

# 第 4 步：移动到系统路径（使其在任何目录下都能使用）
sudo mv lego /usr/local/bin/lego

# 第 5 步：验证安装
lego --version
# 输出类似：lego version 4.22.1
```

##### 方式二：使用 Docker

```bash
# 直接使用 Docker 运行（无需安装）
# 注意：需要挂载本地目录来保存证书和账户信息
docker run --rm \
  -v ./lego-data:/.lego \
  goacme/lego --help

# 后续所有 lego 命令都可以通过 Docker 运行
# 只需要把 `lego` 替换为：
docker run --rm \
  -v ./lego-data:/.lego \
  goacme/lego
```

##### 方式三：使用 Docker Compose

```yaml
# compose.yaml
services:
  lego:
    image: goacme/lego
    volumes:
      - ./lego-data:/.lego          # 证书和账户数据持久化
      - ./certs:/certs              # 导出证书到宿主机
    environment:
      - TZ=Asia/Shanghai
```

#### 域名验证方式（Challenge Types）

Let's Encrypt 需要验证你确实拥有某个域名。lego 支持三种验证方式：

```
┌─────────────────────────────────────────────────────────────┐
│                    三种验证方式对比                           │
├──────────┬──────────────┬──────────────┬───────────────────┤
│          │   HTTP-01    │ TLS-ALPN-01  │     DNS-01        │
├──────────┼──────────────┼──────────────┼───────────────────┤
│ 验证原理 │ 在网站放文件  │ 在端口放证书  │ 在 DNS 加 TXT 记录│
│ 需要端口 │ 80           │ 443          │ 无（不需要开端口） │
│ 通配符   │ ❌ 不支持     │ ❌ 不支持     │ ✅ 支持 *.域名    │
│ 自动化   │ 简单         │ 简单         │ 需 DNS 服务商 API │
│ 内网可用 │ ❌ 不行       │ ❌ 不行       │ ✅ 可以           │
│ 推荐场景 │ 有 Web 服务器 │ 有 TLS 服务  │ 通配符、内网服务器 │
└──────────┴──────────────┴──────────────┴───────────────────┘
```

##### 方式一：HTTP-01 验证（最常用，适合已有 Nginx 的场景）

**原理：** Let's Encrypt 会访问 `http://你的域名/.well-known/acme-challenge/随机文件`，如果返回正确内容，说明你控制着这个域名。

```
Let's Encrypt ──HTTP GET──▶ http://example.com/.well-known/acme-challenge/xxx
                              │
                              ▼
                         你的 Nginx 服务器
                         （返回 lego 放置的验证文件）
```

**前置条件：**
- 域名已解析到你的服务器 IP（A 记录）
- 服务器的 80 端口可从公网访问

```bash
# 第 1 步：确保域名已解析到本服务器
# 在你的 DNS 服务商添加 A 记录：
# example.com → A → 你的服务器IP

# 验证 DNS 是否生效（替换为你的域名和 IP）
ping example.com
# 应该显示你的服务器 IP

# 第 2 步：确保 80 端口可访问
# 如果 Nginx 正在运行且占用了 80 端口，需要使用 webroot 模式
# 如果 80 端口没有被占用，lego 可以自己启动临时服务器

# ---- 情况 A：80 端口没有被占用（最简单）----
# lego 会临时启动一个 HTTP 服务器来完成验证

lego --email="admin@example.com" \
     --domains="example.com" \
     --domains="www.example.com" \
     --http \
     --http.port=80 \
     --accept-tos \
     run

# ---- 情况 B：Nginx 已占用 80 端口（推荐 webroot 模式）----
# 让 Nginx 和 lego 共存，通过 Nginx 提供验证文件

# 首先在 Nginx 配置中添加 ACME 验证路径
# 在 server 块中添加：
# location /.well-known/acme-challenge/ {
#     root /var/www/acme;
# }

# 然后使用 webroot 模式运行 lego
lego --email="admin@example.com" \
     --domains="example.com" \
     --domains="www.example.com" \
     --http \
     --http.webroot=/var/www/acme \
     --accept-tos \
     run
```

> ⚠️ **关于 `--accept-tos` 参数：** 这表示你同意 Let's Encrypt 的服务条款（Terms of Service）。首次使用必须加上。

##### 方式二：DNS-01 验证（支持通配符证书，适合高级场景）

**原理：** 你在 DNS 中添加一条特定的 TXT 记录，Let's Encrypt 通过查询 DNS 来验证你拥有该域名。

```
Let's Encrypt ──DNS TXT 查询──▶ _acme-challenge.example.com
                                 │
                                 ▼
                          返回你设置的 TXT 记录值
                          （由 lego 通过 DNS API 自动设置）
```

**优势：** 不需要开放任何端口，支持通配符证书（`*.example.com`），内网服务器也能用。

**前置条件：** 你的 DNS 服务商支持 API 操作。lego 支持 180+ DNS 服务商，以下列出常见的：

| DNS 服务商    | lego 中的名称 | 需要的环境变量                                               |
| ------------- | ------------- | ------------------------------------------------------------ |
| Cloudflare    | `cloudflare`  | `CLOUDFLARE_DNS_API_TOKEN`                                   |
| 阿里云 DNS    | `alidns`      | `ALICLOUD_ACCESS_KEY`, `ALICLOUD_SECRET_KEY`                 |
| 腾讯云 DNSPod | `dnspod`      | `DNSPOD_API_KEY`                                             |
| 华为云 DNS    | `huaweicloud` | `HUAWEICLOUD_ACCESS_KEY_ID`, `HUAWEICLOUD_SECRET_ACCESS_KEY` |
| AWS Route53   | `route53`     | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`                 |

**以 Cloudflare 为例（最常见的免费 DNS 服务商）：**

```bash
# 第 1 步：在 Cloudflare 获取 API Token
# 登录 https://dash.cloudflare.com
# 进入 My Profile → API Tokens → Create Token
# 选择 "Edit zone DNS" 模板
# 保存生成的 Token（只显示一次！）

# 第 2 步：设置环境变量（替换为你的真实 Token）
export CLOUDFLARE_DNS_API_TOKEN="your-api-token-here"

# 第 3 步：申请证书（含通配符）
lego --email="admin@example.com" \
     --domains="example.com" \
     --domains="*.example.com" \
     --dns="cloudflare" \
     --accept-tos \
     run
```

**以阿里云 DNS 为例（国内常用）：**

```bash
# 第 1 步：在阿里云控制台创建 AccessKey
# 登录 https://ram.console.aliyun.com
# 创建 AccessKey，获取 AccessKey ID 和 AccessKey Secret

# 第 2 步：设置环境变量
export ALICLOUD_ACCESS_KEY="your-access-key-id"
export ALICLOUD_SECRET_KEY="your-access-key-secret"

# 第 3 步：申请证书
lego --email="admin@example.com" \
     --domains="example.com" \
     --domains="*.example.com" \
     --dns="alidns" \
     --accept-tos \
     run
```

> 💡 **通配符证书说明：** `*.example.com` 可以匹配 `www.example.com`、`api.example.com` 等所有子域名，但**不匹配** `example.com` 本身和 `a.b.example.com`（只匹配一级子域名）。所以通常需要同时申请两个域名。

##### 方式三：TLS-ALPN-01 验证（较少使用）

**原理：** 与 HTTP-01 类似，但通过 443 端口的 TLS 握手来验证。

```bash
# 需要 443 端口未被占用，或使用 --tls.port 指定其他端口
lego --email="admin@example.com" \
     --domains="example.com" \
     --tls \
     --accept-tos \
     run
```

#### 证书获取后的文件说明

运行 `lego ... run` 成功后，默认在当前目录的 `.lego/` 文件夹中生成以下文件：

```
.lego/
├── accounts/
│   └── acme-v02.api.letsencrypt.org/
│       └── admin@example.com/
│           ├── account.json     # 你的 ACME 账户信息
│           └── keys/
│               └── admin@example.com.key  # 账户私钥（用于后续续期）
└── certificates/
    ├── example.com.crt          # 证书文件（仅服务器证书）
    ├── example.com.issuer.crt   # 中间证书
    ├── example.com.json         # 证书元数据
    └── example.com.key          # 证书私钥（⚠️ 绝对不能泄露！）
```

**Nginx 需要的两个关键文件：**

| Nginx 配置项          | 对应文件                     | 说明                 |
| --------------------- | ---------------------------- | -------------------- |
| `ssl_certificate`     | `example.com.crt` + 中间证书 | 需要合并为完整证书链 |
| `ssl_certificate_key` | `example.com.key`            | 证书私钥             |

```bash
# 创建完整证书链（fullchain = 服务器证书 + 中间证书）
# 这是 Nginx 的 ssl_certificate 需要的格式
cat .lego/certificates/example.com.crt \
    .lego/certificates/example.com.issuer.crt \
    > /etc/nginx/certs/example.com.fullchain.pem

# 复制私钥
cp .lego/certificates/example.com.key \
   /etc/nginx/certs/example.com.key

# 设置安全权限（⚠️ 私钥文件只能被 root 读取）
sudo chmod 600 /etc/nginx/certs/example.com.key
sudo chmod 644 /etc/nginx/certs/example.com.fullchain.pem
```

> 💡 **为什么需要 fullchain？** 浏览器需要完整的证书链来验证你的证书是否可信。如果只提供服务器证书，某些浏览器会报"不受信任"错误。

#### 证书续期

Let's Encrypt 的证书有效期只有 **90 天**，所以需要定期续期。

```bash
# 续期命令（只需把 run 改为 renew）
# 默认在证书到期前 30 天才会真正续期
lego --email="admin@example.com" \
     --domains="example.com" \
     --http \
     renew

# 自定义续期阈值（提前 45 天续期）
lego --email="admin@example.com" \
     --domains="example.com" \
     --http \
     renew --days=45

# DNS 验证方式的续期
lego --email="admin@example.com" \
     --domains="example.com" \
     --domains="*.example.com" \
     --dns="cloudflare" \
     renew

# 续期成功后，重新加载 Nginx（使新证书生效）
# 注意：续期后需要重新复制证书文件并 reload Nginx
sudo nginx -s reload
```

**设置自动续期（定时任务）：**

```bash
# 方式一：使用 crontab（推荐）

# 编辑定时任务
sudo crontab -e

# 添加以下内容（每天凌晨 3 点检查续期）
# 续期脚本
0 3 * * * /usr/local/bin/lego --email="admin@example.com" --domains="example.com" --http --http.webroot=/var/www/acme renew --days=30 && cat /root/.lego/certificates/example.com.crt /root/.lego/certificates/example.com.issuer.crt > /etc/nginx/certs/example.com.fullchain.pem && cp /root/.lego/certificates/example.com.key /etc/nginx/certs/example.com.key && chmod 600 /etc/nginx/certs/example.com.key && docker exec nginx-proxy nginx -s reload
```

```bash
# 方式二：创建续期脚本（更易维护）

sudo tee /usr/local/bin/renew-cert.sh <<'SCRIPT'
#!/bin/bash
# Let's Encrypt 证书自动续期脚本

# ===== 配置区域（根据你的实际情况修改） =====
DOMAIN="example.com"
EMAIL="admin@example.com"
CERT_DIR="/etc/nginx/certs"
LEGO_DIR="/root/.lego"
NGINX_CMD="docker exec nginx-proxy nginx -s reload"

# ===== 执行续期 =====
echo "[$(date)] 开始检查证书续期..."

lego --email="${EMAIL}" \
     --domains="${DOMAIN}" \
     --http \
     --http.webroot=/var/www/acme \
     renew --days=30

# 检查续期是否成功（通过退出码判断）
if [ $? -eq 0 ]; then
    echo "[$(date)] 证书已更新，正在部署..."

    # 合并证书链
    cat "${LEGO_DIR}/certificates/${DOMAIN}.crt" \
        "${LEGO_DIR}/certificates/${DOMAIN}.issuer.crt" \
        > "${CERT_DIR}/${DOMAIN}.fullchain.pem"

    # 复制私钥
    cp "${LEGO_DIR}/certificates/${DOMAIN}.key" \
       "${CERT_DIR}/${DOMAIN}.key"
    chmod 600 "${CERT_DIR}/${DOMAIN}.key"

    # 重新加载 Nginx
    ${NGINX_CMD}

    echo "[$(date)] 证书部署完成！"
else
    echo "[$(date)] 证书未到续期时间或续期失败。"
fi
SCRIPT

# 给脚本执行权限
sudo chmod +x /usr/local/bin/renew-cert.sh

# 添加到 crontab（每天凌晨 3 点执行）
sudo crontab -e
# 添加：
# 0 3 * * * /usr/local/bin/renew-cert.sh >> /var/log/lego-renew.log 2>&1
```

#### 证书撤销

如果私钥泄露或不再需要证书，可以撤销它：

```bash
# 撤销证书
lego --email="admin@example.com" \
     --domains="example.com" \
     --http \
     revoke
```

#### 其他常用 lego 命令

```bash
# 查看已管理的所有证书
lego list

# 只查看证书域名（简化输出）
lego list --names

# 查看已注册的账户
lego list --accounts

# 使用 Let's Encrypt 测试环境（不会消耗正式证书配额，调试用）
# 测试环境颁发的证书不被浏览器信任，但流程与正式环境完全一致
lego --email="admin@example.com" \
     --domains="example.com" \
     --http \
     --server="https://acme-staging-v02.api.letsencrypt.org/directory" \
     --accept-tos \
     run

# 指定证书存储路径（默认是当前目录的 .lego/）
lego --path="/opt/lego-data" \
     --email="admin@example.com" \
     --domains="example.com" \
     --http \
     run

# 指定密钥类型（默认 ECDSA P256，也可选 RSA 2048/4096）
lego --email="admin@example.com" \
     --domains="example.com" \
     --http \
     --key-type="rsa4096" \
     run
```

#### Let's Encrypt 速率限制

Let's Encrypt 对证书申请有频率限制，避免滥用：

| 限制类型           | 限制值            | 说明                                   |
| ------------------ | ----------------- | -------------------------------------- |
| 每个域名每周证书数 | 50 张             | 每周每个注册域名最多申请 50 张不同证书 |
| 重复证书限制       | 每周 5 张         | 相同域名的重复证书每周最多 5 张        |
| 验证失败限制       | 每小时 5 次       | 每个账户每小时最多 5 次验证失败        |
| 账户注册限制       | 每个 IP 3 个/小时 | 每个 IP 每小时最多注册 3 个账户        |

> ⚠️ **重要提示：** 测试时务必使用 **staging 环境**（加 `--server=https://acme-staging-v02.api.letsencrypt.org/directory`），避免消耗正式配额！

#### 完整实战：使用 lego + Nginx 部署 HTTPS 网站

以下是一个从零开始的完整流程，将一个域名配置为 HTTPS：

**第 1 步：DNS 解析**

在你的 DNS 服务商（如 Cloudflare、阿里云）添加 A 记录：

```
类型    主机记录    记录值
A       @         123.45.67.89    （你的服务器 IP）
A       www       123.45.67.89
```

**第 2 步：安装 lego**（参考上文"安装 lego"部分）

**第 3 步：配置 Nginx 支持 ACME 验证**

```nginx
# /etc/nginx/conf.d/example.com.conf
server {
    listen 80;
    server_name example.com www.example.com;

    # 让 lego 能通过 Nginx 完成 HTTP-01 验证
    location /.well-known/acme-challenge/ {
        root /var/www/acme;
    }

    # 其他请求重定向到 HTTPS（申请证书后再启用）
    # location / {
    #     return 301 https://$host$request_uri;
    # }
}
```

```bash
# 创建验证文件目录
sudo mkdir -p /var/www/acme

# 测试并重新加载 Nginx
sudo nginx -t && sudo nginx -s reload
```

**第 4 步：申请证书**

```bash
# 先用测试环境验证流程是否正确
lego --email="admin@example.com" \
     --domains="example.com" \
     --domains="www.example.com" \
     --http \
     --http.webroot=/var/www/acme \
     --server="https://acme-staging-v02.api.letsencrypt.org/directory" \
     --accept-tos \
     run

# 看到成功信息后，去掉 --server 参数，使用正式环境
lego --email="admin@example.com" \
     --domains="example.com" \
     --domains="www.example.com" \
     --http \
     --http.webroot=/var/www/acme \
     --accept-tos \
     run
```

**第 5 步：部署证书到 Nginx**

```bash
# 合并证书链
sudo mkdir -p /etc/nginx/certs
cat .lego/certificates/example.com.crt \
    .lego/certificates/example.com.issuer.crt \
    | sudo tee /etc/nginx/certs/example.com.fullchain.pem > /dev/null

# 复制私钥
sudo cp .lego/certificates/example.com.key /etc/nginx/certs/example.com.key
sudo chmod 600 /etc/nginx/certs/example.com.key
```

**第 6 步：配置 Nginx HTTPS**

```nginx
# /etc/nginx/conf.d/example.com.conf（更新后的完整配置）

# HTTP 服务器：处理 ACME 验证 + 重定向到 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;

    # ACME 验证路径（续期时需要）
    location /.well-known/acme-challenge/ {
        root /var/www/acme;
    }

    # 其他请求重定向到 HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS 服务器
server {
    listen 443 ssl;
    server_name example.com www.example.com;

    # SSL 证书路径
    ssl_certificate     /etc/nginx/certs/example.com.fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/example.com.key;

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

```bash
# 测试并重新加载 Nginx
sudo nginx -t && sudo nginx -s reload

# 验证 HTTPS 是否生效
curl -I https://example.com
# 应该看到 HTTP/2 200 等响应
```

**第 7 步：验证证书信息**

```bash
# 查看证书详情
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \
  | openssl x509 -noout -dates -subject -issuer
# 输出类似：
# subject=CN = example.com
# issuer=C = US, O = Let's Encrypt, CN = E5
# notBefore=May 12 00:00:00 2026 GMT
# notAfter=Aug 10 23:59:59 2026 GMT
```

**第 8 步：设置自动续期**（参考上文"证书续期"部分的 crontab 配置）

#### Docker Compose 一键部署示例（lego + Nginx）

以下是一个使用 Docker Compose 同时运行 Nginx 和 lego 的完整配置：

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
      - ./conf.d:/etc/nginx/conf.d:ro
      - ./html:/usr/share/nginx/html:ro
      - ./certs:/etc/nginx/certs:ro
      - acme-challenge:/var/www/acme    # 共享 ACME 验证目录
    restart: unless-stopped

  # 一次性运行 lego 申请证书
  # 只在首次部署或续期时运行
  lego:
    image: goacme/lego
    container_name: lego
    volumes:
      - ./lego-data:/.lego              # 证书和账户数据
      - ./certs:/certs                  # 导出证书给 Nginx
      - acme-challenge:/var/www/acme    # 共享 ACME 验证目录
    environment:
      - DOMAINS=example.com,www.example.com
      - EMAIL=admin@example.com
    # 启动后运行申请命令，完成后自动退出
    command: >
      --email="${EMAIL}"
      --domains="example.com"
      --domains="www.example.com"
      --http
      --http.webroot=/var/www/acme
      --path=/.lego
      --accept-tos
      run
    # 申请成功后合并证书并复制到 /certs 目录
    # （需要用 entrypoint 脚本处理，这里展示基本结构）

volumes:
  acme-challenge:
```

> 💡 **Docker 部署提示：** 实际生产中，建议编写一个 entrypoint 脚本来处理证书申请、合并和 Nginx reload 的完整流程，或者使用外部的定时任务来触发 `docker compose run lego renew`。

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

## 第五部分：常见操作指南（How-to）

> 本部分提供 Nginx 日常运维中最常见的操作场景，按步骤指引。

### 5.1 如何快速排查 502 Bad Gateway 错误

```bash
# 第 1 步：查看 Nginx 错误日志
sudo tail -50 /var/log/nginx/error.log
# Docker 环境：docker logs nginx-proxy

# 第 2 步：确认后端服务是否正常运行
curl http://127.0.0.1:8080/health
# 或检查进程
ps aux | grep your-backend

# 第 3 步：检查后端服务端口是否正确
sudo ss -tlnp | grep 8080

# 第 4 步：检查 Nginx 配置中的 proxy_pass 地址
grep proxy_pass /etc/nginx/conf.d/*.conf
# 确保地址和端口与后端实际一致

# 第 5 步：如果是超时导致的 504，增加超时时间
# 在 location 块中添加：
# proxy_connect_timeout 60s;
# proxy_read_timeout 120s;
# proxy_send_timeout 60s;
```

### 5.2 如何为 Nginx 添加新站点

```bash
# 第 1 步：创建站点配置文件
sudo tee /etc/nginx/conf.d/new-site.conf <<'EOF'
server {
    listen 80;
    server_name newsite.example.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# 第 2 步：测试配置语法
sudo nginx -t

# 第 3 步：重新加载配置（不中断服务）
sudo nginx -s reload

# Docker 环境
docker exec nginx-proxy nginx -t
docker exec nginx-proxy nginx -s reload
```

### 5.3 如何配置 HTTPS 并自动续期

> 详细的 SSL/HTTPS 教程请参考 [2.4 SSL/HTTPS 配置](#24-sslhttps-配置) 章节，包含 Let's Encrypt + lego 的完整小白教程。

```bash
# 快速流程（使用 lego ACME 客户端）：

# 第 1 步：安装 lego（下载二进制文件）
curl -L -o lego.tar.gz https://github.com/go-acme/lego/releases/download/v4.22.1/lego_v4.22.1_linux_amd64.tar.gz
tar xzf lego.tar.gz && sudo mv lego /usr/local/bin/

# 第 2 步：确保 Nginx 配置了 ACME 验证路径
# 在 server 块中添加：
# location /.well-known/acme-challenge/ { root /var/www/acme; }
sudo mkdir -p /var/www/acme && sudo nginx -s reload

# 第 3 步：获取证书（确保 DNS 已指向本服务器）
lego --email="admin@example.com" --domains="example.com" --domains="www.example.com" \
     --http --http.webroot=/var/www/acme --accept-tos run

# 第 4 步：部署证书并配置 Nginx HTTPS（详见 2.4 节）

# 第 5 步：设置自动续期（添加到 crontab）
# 0 3 * * * /usr/local/bin/renew-cert.sh >> /var/log/lego-renew.log 2>&1
```

### 5.4 如何优化 Nginx 性能

```nginx
# 在 http 块中添加以下配置

# 启用 Gzip 压缩（可减少 60-80% 传输大小）
gzip on;
gzip_comp_level 6;
gzip_min_length 256;
gzip_types text/plain text/css application/javascript application/json image/svg+xml;

# 启用 HTTP/2（需要 HTTPS）
# listen 443 ssl http2;

# 优化连接处理
sendfile on;
tcp_nopush on;
tcp_nodelay on;
keepalive_timeout 65;

# 调整 Worker 配置
# worker_processes auto;          # 自动匹配 CPU 核心数
# worker_connections 2048;        # 每个 Worker 的最大连接数

# 静态资源缓存
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, no-transform";
    access_log off;
}
```

### 5.5 如何查看和分析 Nginx 访问日志

```bash
# 实时查看日志
sudo tail -f /var/log/nginx/access.log

# 统计访问量最大的 IP（排查攻击）
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -20

# 统计各状态码的数量
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# 查找 5xx 错误
awk '$9 >= 500' /var/log/nginx/access.log

# 统计请求量最大的 URL
awk '{print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -20

# 按时间段过滤日志
awk '$4 >= "[15/Jan/2024:10:00" && $4 <= "[15/Jan/2024:12:00"' /var/log/nginx/access.log
```

---

## 第六部分：配置速查表（Reference）

> Nginx 最常用的配置指令和变量，按功能分类整理。

### 6.1 核心配置指令

| 指令                 | 作用域               | 说明                   | 示例   |
| -------------------- | -------------------- | ---------------------- | ------ |
| `worker_processes`   | main                 | Worker 进程数          | `auto` |
| `worker_connections` | events               | 每个 Worker 最大连接数 | `1024` |
| `sendfile`           | http/server/location | 零拷贝传输             | `on`   |
| `tcp_nopush`         | http/server          | 优化数据包发送         | `on`   |
| `keepalive_timeout`  | http/server/location | 长连接超时             | `65`   |
| `gzip`               | http/server/location | Gzip 压缩              | `on`   |
| `server_tokens`      | http/server          | 隐藏版本号             | `off`  |

### 6.2 反向代理指令

| 指令                    | 说明         | 常用值                  |
| ----------------------- | ------------ | ----------------------- |
| `proxy_pass`            | 后端服务地址 | `http://127.0.0.1:8080` |
| `proxy_set_header`      | 设置转发头   | `Host $host`            |
| `proxy_connect_timeout` | 连接后端超时 | `60s`                   |
| `proxy_read_timeout`    | 读取响应超时 | `60s`                   |
| `proxy_send_timeout`    | 发送请求超时 | `60s`                   |
| `proxy_buffering`       | 是否缓冲响应 | `on`                    |
| `proxy_cache`           | 使用的缓存区 | `api_cache`             |

### 6.3 location 匹配规则

| 修饰符 | 匹配方式                     | 优先级 | 示例                           |
| ------ | ---------------------------- | ------ | ------------------------------ |
| `=`    | 精确匹配                     | 最高   | `location = /exact/path {}`    |
| `^~`   | 前缀匹配（匹配后不检查正则） | 次高   | `location ^~ /images/ {}`      |
| `~`    | 区分大小写的正则匹配         | 第三   | `location ~ \.php$ {}`         |
| `~*`   | 不区分大小写的正则匹配       | 第三   | `location ~* \.(jpg\|png)$ {}` |
| 无     | 普通前缀匹配                 | 最低   | `location /api/ {}`            |

### 6.4 常用内置变量

| 变量                      | 说明                         |
| ------------------------- | ---------------------------- |
| `$host`                   | 请求中的 Host 头（域名）     |
| `$remote_addr`            | 客户端 IP 地址               |
| `$request_uri`            | 完整的请求 URI（含查询参数） |
| `$uri`                    | 不含查询参数的 URI           |
| `$args`                   | 查询参数                     |
| `$scheme`                 | 协议（http/https）           |
| `$request_method`         | 请求方法（GET/POST 等）      |
| `$status`                 | 响应状态码                   |
| `$http_user_agent`        | 客户端 User-Agent            |
| `$upstream_addr`          | 后端服务器地址               |
| `$upstream_response_time` | 后端响应耗时                 |
| `$request_time`           | 请求总耗时                   |

### 6.5 常用命令速查

| 命令              | 说明               |
| ----------------- | ------------------ |
| `nginx`           | 启动 Nginx         |
| `nginx -s stop`   | 快速停止           |
| `nginx -s quit`   | 优雅停止           |
| `nginx -s reload` | 重新加载配置       |
| `nginx -t`        | 测试配置语法       |
| `nginx -v`        | 查看版本           |
| `nginx -V`        | 查看版本和编译参数 |

---

## 第七部分：故障排除

### 问题 1：502 Bad Gateway

**常见原因：**
- 后端服务未启动或崩溃
- proxy_pass 地址配置错误
- 后端服务响应超时

**排查步骤：**
```bash
# 检查后端服务状态
curl http://127.0.0.1:8080/
# 如果连接被拒绝，说明后端未运行

# 查看 Nginx 错误日志
tail -20 /var/log/nginx/error.log

# 确认端口配置
grep proxy_pass /etc/nginx/conf.d/*.conf
```

### 问题 2：403 Forbidden

**常见原因：**
- 文件/目录权限不足
- index 指令未包含默认首页文件名
- 目录下没有 index.html

**排查步骤：**
```bash
# 检查文件权限
ls -la /var/www/html/

# 修复权限
sudo chmod -R 755 /var/www/html/
sudo chown -R www-data:www-data /var/www/html/

# 检查 Nginx 配置中的 root 和 index
grep -E "root|index" /etc/nginx/conf.d/*.conf
```

### 问题 3：配置修改后不生效

```bash
# 第 1 步：测试配置语法
sudo nginx -t

# 第 2 步：重新加载（而非重启，不中断服务）
sudo nginx -s reload

# 第 3 步：如果 reload 不生效，完全重启
sudo systemctl restart nginx

# 第 4 步：清除浏览器缓存后测试
curl -I http://example.com
```

### 问题 4：Nginx 启动失败

```bash
# 查看详细错误信息
sudo systemctl status nginx
sudo journalctl -u nginx --since "5 minutes ago"

# 常见原因：
# 1. 端口被占用
sudo lsof -i :80
# 解决：停止占用端口的程序或修改 listen 端口

# 2. 配置文件语法错误
sudo nginx -t
# 根据提示修复错误行

# 3. SSL 证书文件不存在或权限错误
ls -la /etc/nginx/certs/
```

### 问题 5：高并发下性能下降

```nginx
# 检查并调整以下配置

# 增加 Worker 连接数
events {
    worker_connections 4096;
}

# 启用多 accept
events {
    multi_accept on;
}

# 启用连接复用
upstream backend {
    keepalive 32;    # 保持 32 个空闲长连接到后端
    server 127.0.0.1:8080;
}

# 在 location 中使用
location / {
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_pass http://backend;
}
```

---

## 总结与下一步

### 你已经学到了什么

| 部分        | 核心收获                                           |
| ----------- | -------------------------------------------------- |
| Nginx 基础  | 事件驱动架构、安装、配置文件层级、基础命令         |
| 核心功能    | 静态服务、反向代理、负载均衡、SSL/HTTPS、虚拟主机  |
| 进阶功能    | URL 重写、Gzip 压缩、缓存策略、访问控制、限流      |
| Docker 部署 | 容器化 Nginx、多站点管理、Docker Compose 编排      |
| How-to 指南 | 502 排查、添加站点、HTTPS 配置、性能优化、日志分析 |

### 推荐的学习路径

```
✅ 你在这里
│
├──▶ [Docker 入门到进阶](../01-docker/README.md)
│    深入学习 Docker Compose 多服务编排
│
├──▶ [配置文件语法](../03-config-format/README.md)
│    掌握 Nginx 配置文件和 Docker Compose 使用的 YAML 语法
│
└──▶ [Linux 常用运维命令](../04-linux-commands/README.md)
     学习 curl、systemd 等与 Nginx 运维密切相关的命令
```

### 进阶学习建议

1. **性能调优**：学习 Nginx 的 Benchmark 工具（wrk、ab），针对实际业务优化配置
2. **安全加固**：配置 WAF（ModSecurity）、DDoS 防护、CSP 安全头
3. **Nginx Plus**：了解商业版的高级功能（主动健康检查、API 网关、JWT 验证）
4. **Ingress Controller**：学习在 Kubernetes 中使用 Nginx Ingress Controller

---

## 参考链接

- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Nginx Docker 镜像](https://hub.docker.com/_/nginx)
- [Let's Encrypt 官网](https://letsencrypt.org/)
- [Let's Encrypt ACME 协议文档](https://letsencrypt.org/docs/challenge-types/)
- [lego ACME 客户端（GitHub）](https://github.com/go-acme/lego)
- [lego 支持的 DNS 服务商列表](https://go-acme.github.io/lego/dns/)
- [Nginx 速查表](https://wangchujiang.com/reference/nginx.html)
- [Mozilla SSL 配置生成器](https://ssl-config.mozilla.org/)
