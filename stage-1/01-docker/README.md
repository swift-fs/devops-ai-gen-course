# Docker 从入门到进阶完整教程

> 适用版本：Docker Engine 27.x / Docker Compose V2+（含 V5） / Dockerfile 最新语法  
> 最后更新：2026-05

---

## 学习目标

完成本教程后，你将能够：

- ✅ 理解容器化的核心概念（镜像、容器、仓库）及其与传统部署的区别
- ✅ 独立安装和配置 Docker 环境（包括国内镜像加速）
- ✅ 使用 Docker 命令管理镜像和容器的完整生命周期
- ✅ 编写生产级 Dockerfile（包括多阶段构建和安全最佳实践）
- ✅ 使用 Docker Compose 编排多容器应用（数据库 + 缓存 + Web 服务）
- ✅ 排查常见的 Docker 问题（网络、存储、构建错误等）

## 前置条件

| 条件               | 说明                                       | 必要性 |
| ------------------ | ------------------------------------------ | ------ |
| Linux 基础         | 熟悉基本命令行操作（`cd`、`ls`、`cat` 等） | 必需   |
| Debian/Ubuntu 系统 | 本教程以 Debian/Ubuntu 为主要环境          | 推荐   |
| 基本网络概念       | 了解 IP、端口、DNS 等基本概念              | 有帮助 |
| 任意编程语言       | Python/Node.js/Go 基础有助于理解实战案例   | 有帮助 |

> 💡 **没有 Linux 基础？** 建议先完成本课程的 [Linux 常用运维命令](../04-linux-commands/README.md) 章节。

---

## 目录

- [第一部分：Docker 基础](#第一部分docker-基础)
  - [1.1 什么是 Docker](#11-什么是-docker)
  - [1.2 Docker 核心概念](#12-docker-核心概念)
  - [1.3 安装 Docker](#13-安装-docker)
  - [1.4 镜像管理](#14-镜像管理)
  - [1.5 容器管理](#15-容器管理)
  - [1.6 数据管理](#16-数据管理)
  - [1.7 网络管理](#17-网络管理)
- [第二部分：Dockerfile](#第二部分dockerfile)
  - [2.1 Dockerfile 基础](#21-dockerfile-基础)
  - [2.2 常用指令详解](#22-常用指令详解)
  - [2.3 多阶段构建](#23-多阶段构建)
  - [2.4 最佳实践](#24-最佳实践)
  - [2.5 实战案例](#25-实战案例)
- [第三部分：Docker Compose](#第三部分docker-compose)
  - [3.1 Compose 基础](#31-compose-基础)
  - [3.2 compose.yaml 详解](#32-composeyaml-详解)
    - [基本结构](#基本结构)
    - [最简入门示例](#最简入门示例)
    - [完整示例：Web 应用 + 数据库 + 缓存](#完整示例web-应用--数据库--缓存)
    - [常用服务配置项说明](#常用服务配置项说明)
    - [网络配置详解](#网络配置详解)
    - [数据卷配置详解](#数据卷配置详解)
    - [环境变量详解](#环境变量详解)
    - [entrypoint 和 command 的区别](#entrypoint-和-command-的区别)
    - [profiles：按场景启动服务](#profiles按场景启动服务)
    - [多环境配置（Override 与多文件合并）](#多环境配置override-与多文件合并)
  - [3.3 常用命令](#33-常用命令)
  - [3.4 实战案例](#34-实战案例)
- [第四部分：常见操作指南（How-to）](#第四部分常见操作指南how-to)
- [第五部分：命令速查表（Reference）](#第五部分命令速查表reference)
- [第六部分：故障排除](#第六部分故障排除)
- [总结与下一步](#总结与下一步)
- [参考链接](#参考链接)

---

## 第一部分：Docker 基础

### 1.1 什么是 Docker

Docker 是一个开源的**容器化平台**，它允许你将应用程序及其所有依赖项打包到一个标准化的单元（容器）中，从而确保应用在任何环境中都能一致地运行。

**传统部署 vs 容器化部署：**

<table>
<tr>
<th width="50%">传统方式：物理服务器 / 虚拟机</th>
<th width="50%">Docker 方式：容器化部署</th>
</tr>
<tr>
<td align="center">
  <table width="100%">
    <tr>
      <td align="center" style="background-color:#3b2f1a;padding:10px;border:1px solid #5a4a2a"><b style="color:#f59e0b">App A</b><br><small style="color:#fbbf24">依赖 v1 ⚠️</small></td>
      <td align="center" style="background-color:#1a2e1a;padding:10px;border:1px solid #2a4a2a"><b style="color:#10b981">App B</b><br><small style="color:#34d399">依赖 v2</small></td>
      <td align="center" style="background-color:#1a2e1a;padding:10px;border:1px solid #2a4a2a"><b style="color:#10b981">App C</b><br><small style="color:#34d399">依赖 v1</small></td>
    </tr>
    <tr>
      <td colspan="3" align="center" style="background-color:#2e1a1a;padding:8px;border:1px solid #4a2a2a"><span style="color:#f87171">⚠️ 共享操作系统 — 依赖可能冲突</span></td>
    </tr>
  </table>
</td>
<td align="center">
  <table width="100%">
    <tr>
      <td align="center" style="background-color:#1a2a3e;padding:10px;border:1px solid #2a3a5a"><b style="color:#60a5fa">容器 A</b><br><small style="color:#93c5fd">App A + 独立依赖</small></td>
      <td align="center" style="background-color:#1a2a3e;padding:10px;border:1px solid #2a3a5a"><b style="color:#60a5fa">容器 B</b><br><small style="color:#93c5fd">App B + 独立依赖</small></td>
      <td align="center" style="background-color:#1a2a3e;padding:10px;border:1px solid #2a3a5a"><b style="color:#60a5fa">容器 C</b><br><small style="color:#93c5fd">App C + 独立依赖</small></td>
    </tr>
    <tr>
      <td colspan="3" align="center" style="background-color:#1a2e1a;padding:8px;border:1px solid #2a4a2a"><span style="color:#34d399">✅ Docker Engine — 宿主操作系统</span></td>
    </tr>
  </table>
</td>
</tr>
</table>

**Docker vs 虚拟机的区别：**

| 特性     | Docker 容器  | 虚拟机       |
| -------- | ------------ | ------------ |
| 启动速度 | 秒级         | 分钟级       |
| 磁盘占用 | MB 级        | GB 级        |
| 性能     | 接近原生     | 有损耗       |
| 系统支持 | 共享宿主内核 | 独立操作系统 |
| 隔离性   | 进程级隔离   | 完全隔离     |

### 1.2 Docker 核心概念

Docker 有三个核心概念，理解它们是掌握 Docker 的关键：

```
镜像 (Image)  ──运行──▶  容器 (Container)
   │                           │
   │ 构建                      │ 可以提交为新镜像
   ▼                           ▼
Dockerfile                运行中的实例
   
仓库 (Registry) ──存放──▶ 镜像 (Image)
   │
   │ 推送/拉取
   ▼
Docker Hub / 私有仓库
```

- **镜像（Image）**：只读模板，包含创建容器所需的所有文件系统和配置。类似于"安装包"。
- **容器（Container）**：镜像的运行实例。类似于"正在运行的程序"。可以被创建、启动、停止、删除。
- **仓库（Registry）**：存放镜像的地方。Docker Hub 是最大的公共仓库。

### 1.3 安装 Docker

#### 1.3.1 Debian/Ubuntu 上安装（推荐方式）

```bash
# 1. 更新包索引并安装必要依赖
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# 2. 添加 Docker 官方 GPG 密钥
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. 添加 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. 安装 Docker Engine（最新版）
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

# 5. 验证安装
docker --version
# 输出示例：Docker version 27.x.x, build xxxxxxx

docker compose version
# 输出示例：Docker Compose version v2.32.x 或 v5.x.x

# 6. 运行测试容器
sudo docker run hello-world
```

#### 1.3.2 配置非 root 用户使用 Docker（强烈推荐）

```bash
# 将当前用户加入 docker 组，这样就不需要每次都加 sudo
sudo usermod -aG docker $USER

# 使组变更立即生效（或重新登录）
newgrp docker

# 验证：不需要 sudo 就能运行
docker run hello-world
```

#### 1.3.3 配置 Docker 镜像加速（国内用户推荐）

由于国内网络环境变化，镜像加速源经常失效。建议参考 [DockerHub 国内加速镜像列表](https://github.com/dongyubin/DockerHub) 获取最新可用的加速源。

```bash
# 编辑 Docker 配置文件
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<'EOF'
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://dockerproxy.net",
    "https://docker.m.daocloud.io",
    "https://proxy.vvvv.ee"
  ]
}
EOF

# 重启 Docker 服务使配置生效
sudo systemctl daemon-reload
sudo systemctl restart docker

# 验证加速源是否生效
docker info | grep -A 5 "Registry Mirrors"
```

> ⚠️ **注意**：镜像加速源可能随时失效，如果拉取镜像时超时，请访问上面的链接获取最新可用地址。
> 部分加速源仅提供基础镜像或白名单镜像，如果某个地址无法拉取，可以尝试切换其他地址。

#### 1.3.4 使用替代镜像仓库（加速源全部失效时的备选方案）

如果加速源都不可用，可以使用 **Amazon ECR Public** 作为替代。它同步了 Docker Hub 的官方镜像，国内访问速度较快，但需要修改镜像拉取方式：

```bash
# ┌──────────────────────────────────────────────────────────────┐
# │ Docker Hub 原始方式              →  ECR Public 替代方式       │
# │ docker pull nginx                →  加上仓库前缀即可          │
# │ docker pull postgres:16          →  public.ecr.aws/...       │
# └──────────────────────────────────────────────────────────────┘

# 格式：public.ecr.aws/docker/library/<镜像名>:<标签>
# 注意：仅支持 Docker Hub 官方镜像（library 下的）

# 示例：
docker pull public.ecr.aws/docker/library/nginx:latest
docker pull public.ecr.aws/docker/library/postgres:16
docker pull public.ecr.aws/docker/library/redis:7-alpine
docker pull public.ecr.aws/docker/library/python:3.12-slim
docker pull public.ecr.aws/docker/library/node:20-alpine

# 拉取后可以重新打标签，让 docker-compose 等工具正常使用
docker tag public.ecr.aws/docker/library/nginx:latest nginx:latest

# 验证 hello-world
docker pull public.ecr.aws/docker/library/hello-world:latest
docker run public.ecr.aws/docker/library/hello-world:latest
```

> 📌 **提示**：ECR Public 的镜像浏览页面在 [https://gallery.ecr.aws/docker/library/](https://gallery.ecr.aws/docker/library/)，
> 可以查看所有可用的官方镜像和标签。注意它**不支持第三方镜像**（非 library 下的），第三方镜像仍需使用加速源或自建代理。

#### 1.3.5 Docker 服务管理

```bash
# 启动 Docker
sudo systemctl start docker

# 停止 Docker
sudo systemctl stop docker

# 重启 Docker
sudo systemctl restart docker

# 设置开机自启
sudo systemctl enable docker

# 查看 Docker 状态
sudo systemctl status docker

# 查看 Docker 系统信息（包含版本、存储驱动、容器数量等）
docker info
```

---

### 1.4 镜像管理

#### 1.4.1 搜索镜像

```bash
# 在 Docker Hub 搜索镜像
docker search nginx

# 输出示例：
# NAME               DESCRIPTION                     STARS   OFFICIAL
# nginx              Official build of Nginx.         19000   [OK]
# bitnami/nginx      Bitnami container image for Nginx 180
# ...

# 只显示官方镜像
docker search --filter is-official=true nginx

# 限制显示数量
docker search --limit 5 nginx
```

#### 1.4.2 拉取镜像

```bash
# 拉取最新版镜像（默认 latest 标签）
docker pull nginx

# 拉取指定版本
docker pull nginx:1.27

# 拉取指定平台的镜像
docker pull --platform linux/amd64 nginx:1.27

# 从其他仓库拉取（例如 GitHub Container Registry）
docker pull ghcr.io/owner/image:tag
```

#### 1.4.3 查看与管理镜像

```bash
# 列出本地所有镜像
docker images
# 或
docker image ls

# 输出示例：
# REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
# nginx        latest    abc123def456   2 days ago     187MB
# python       3.12      789ghi012jkl   5 days ago     1.02GB

# 只显示镜像 ID
docker images -q

# 过滤镜像（按仓库名）
docker images nginx

# 查看镜像详细信息
docker inspect nginx:latest

# 查看镜像构建历史（了解每一层做了什么）
docker history nginx:latest

# 删除镜像（必须没有容器在使用）
docker rmi nginx:1.27
# 或
docker image rm nginx:1.27

# 删除所有未使用的镜像（释放磁盘空间）
docker image prune -a

# 给镜像打标签（用于推送到仓库）
docker tag nginx:latest myregistry.com/mynginx:v1.0
```

#### 1.4.4 导出与导入镜像

```bash
# 将镜像保存为 tar 文件（离线传输用）
docker save -o nginx.tar nginx:latest

# 也可以同时保存多个镜像
docker save -o images.tar nginx:latest redis:latest

# 从 tar 文件加载镜像
docker load -i nginx.tar
```

---

### 1.5 容器管理

#### 1.5.1 创建并运行容器

```bash
# 基本运行方式
docker run nginx

# 常用参数完整示例
docker run \
  --name my-nginx \          # 给容器命名
  -d \                        # 后台运行（detached 模式）
  -p 8080:80 \               # 端口映射：宿主机端口:容器端口
  -v /host/data:/container/data \  # 挂载数据卷
  -e TZ=Asia/Shanghai \      # 设置环境变量
  --restart unless-stopped \ # 重启策略
  nginx:latest

# 各参数说明：
# --name        容器名称，不指定则自动生成随机名
# -d            后台运行，不占用当前终端
# -p            端口映射，格式 宿主机端口:容器端口
# -v            数据卷挂载，格式 宿主机路径:容器路径
# -e            设置环境变量
# --restart     重启策略：
#               no（默认）- 不自动重启
#               always - 总是重启
#               unless-stopped - 除非手动停止，否则总是重启
#               on-failure[:max-retries] - 仅当异常退出时重启

# 交互式运行（进入容器内部）
docker run -it ubuntu:latest /bin/bash
# -i 保持标准输入打开
# -t 分配一个伪终端

# 运行后自动删除容器（适合一次性任务）
docker run --rm alpine echo "Hello Docker"
```

#### 1.5.2 查看容器

```bash
# 查看正在运行的容器
docker ps

# 输出示例：
# CONTAINER ID  IMAGE    COMMAND                 CREATED       STATUS       PORTS                  NAMES
# a1b2c3d4e5f6  nginx    "/docker-entrypoint.…"  10 mins ago   Up 10 mins   0.0.0.0:8080->80/tcp   my-nginx

# 查看所有容器（包括已停止的）
docker ps -a

# 只显示容器 ID
docker ps -q

# 显示容器占用的资源（CPU、内存、网络 IO 等）
docker stats

# 实时监控特定容器
docker stats my-nginx
```

#### 1.5.3 容器生命周期管理

```bash
# 启动已停止的容器
docker start my-nginx

# 停止运行中的容器（发送 SIGTERM，10秒后 SIGKILL）
docker stop my-nginx

# 强制停止容器（立即发送 SIGKILL）
docker kill my-nginx

# 重启容器
docker restart my-nginx

# 暂停容器（冻结所有进程）
docker pause my-nginx

# 恢复暂停的容器
docker unpause my-nginx

# 删除已停止的容器
docker rm my-nginx

# 强制删除运行中的容器
docker rm -f my-nginx

# 删除所有已停止的容器
docker container prune
```

#### 1.5.4 进入容器与调试

```bash
# 在运行中的容器内执行命令（推荐方式）
docker exec -it my-nginx /bin/bash

# 如果容器没有 bash，使用 sh
docker exec -it my-nginx /bin/sh

# 直接执行单个命令（不进入交互模式）
docker exec my-nginx cat /etc/nginx/nginx.conf

# 查看容器日志
docker logs my-nginx

# 实时跟踪日志输出（类似 tail -f）
docker logs -f my-nginx

# 查看最后 100 行日志
docker logs --tail 100 my-nginx

# 查看容器内进程
docker top my-nginx

# 查看容器详细信息
docker inspect my-nginx

# 查看容器资源使用情况
docker stats --no-stream my-nginx
```

#### 1.5.5 容器与宿主机之间的文件拷贝

```bash
# 从容器拷贝文件到宿主机
docker cp my-nginx:/etc/nginx/nginx.conf ./nginx.conf

# 从宿主机拷贝文件到容器
docker cp ./custom.conf my-nginx:/etc/nginx/conf.d/custom.conf

# 拷贝整个目录
docker cp my-nginx:/var/log/nginx/ ./nginx-logs/
```

---

### 1.6 数据管理

Docker 容器的文件系统是临时的——容器删除后，数据也会丢失。因此需要使用**数据卷（Volume）**或**绑定挂载（Bind Mount）**来持久化数据。

#### 1.6.1 数据卷（Volume）—— 推荐方式

```bash
# 创建数据卷
docker volume create my-data

# 列出所有数据卷
docker volume ls

# 查看数据卷详细信息
docker volume inspect my-data

# 使用数据卷运行容器
docker run -d \
  --name my-app \
  -v my-data:/app/data \    # 格式：卷名:容器路径
  nginx:latest

# 删除数据卷
docker volume rm my-data

# 删除所有未使用的数据卷
docker volume prune
```

#### 1.6.2 绑定挂载（Bind Mount）

```bash
# 将宿主机目录挂载到容器（开发环境常用）
docker run -d \
  --name my-app \
  -v /home/user/project:/app \    # 格式：宿主机路径:容器路径
  nginx:latest

# 使用只读模式挂载
docker run -d \
  --name my-app \
  -v /home/user/config:/etc/nginx/conf.d:ro \    # :ro 表示只读
  nginx:latest

# 使用相对路径（Docker Compose 中更常用）
docker run -d \
  -v ./html:/usr/share/nginx/html \
  nginx:latest
```

#### 1.6.3 tmpfs 挂载（内存文件系统）

```bash
# 临时文件存储在内存中，容器停止后消失
# 适合存储临时数据、敏感数据
docker run -d \
  --name my-app \
  --tmpfs /app/tmp \       # 挂载 tmpfs 到 /app/tmp
  nginx:latest
```

**三种挂载方式对比：**

| 类型       | 命令格式              | 数据存储位置   | 适用场景           |
| ---------- | --------------------- | -------------- | ------------------ |
| Volume     | `-v vol-name:/path`   | Docker 管理    | 生产环境数据持久化 |
| Bind Mount | `-v /host/path:/path` | 宿主机指定路径 | 开发环境代码同步   |
| tmpfs      | `--tmpfs /path`       | 内存           | 临时数据、敏感信息 |

---

### 1.7 网络管理

#### 1.7.1 Docker 网络模式

```bash
# 查看所有网络
docker network ls

# 输出示例：
# NETWORK ID     NAME      DRIVER    SCOPE
# a1b2c3d4e5f6   bridge    bridge    local
# b2c3d4e5f6a1   host      host      local
# c3d4e5f6a1b2   none      null      local
```

**四种网络模式：**

| 模式             | 说明                               | 使用场景           |
| ---------------- | ---------------------------------- | ------------------ |
| `bridge`（默认） | 容器通过虚拟网桥通信，需要端口映射 | 大多数应用         |
| `host`           | 容器直接使用宿主机网络，无隔离     | 需要高性能网络     |
| `none`           | 容器没有网络                       | 安全隔离、离线计算 |
| `overlay`        | 跨主机容器通信                     | Docker Swarm 集群  |

#### 1.7.2 自定义网络

```bash
# 创建自定义网络
docker network create my-network

# 创建指定子网的网络
docker network create --subnet=172.20.0.0/16 my-network

# 容器加入网络（运行时指定）
docker run -d \
  --name app-server \
  --network my-network \
  nginx:latest

# 同一网络中的容器可以通过容器名互相访问
# 例如：在 app-server 中可以用 curl http://db-server:3306 访问另一个容器

# 将运行中的容器加入网络
docker network connect my-network my-container

# 将容器从网络断开
docker network disconnect my-network my-container

# 查看网络详情
docker network inspect my-network

# 删除网络
docker network rm my-network

# 清理未使用的网络
docker network prune
```

#### 1.7.3 端口映射

```bash
# 映射指定端口
docker run -d -p 8080:80 nginx          # 宿主机 8080 -> 容器 80

# 映射到指定地址
docker run -d -p 127.0.0.1:8080:80 nginx  # 只监听本地回环地址

# 随机端口映射
docker run -d -P nginx                    # -P 大写，随机映射所有 EXPOSE 端口

# 查看容器端口映射
docker port my-nginx
```

---

## 第二部分：Dockerfile

### 2.1 Dockerfile 基础

Dockerfile 是一个文本文件，包含了一系列指令，用于自动构建 Docker 镜像。每条指令构建镜像的一层。

```dockerfile
# Dockerfile 基本结构示例
# 语法版本声明（推荐）
# syntax=docker/dockerfile:1

# 基础镜像
FROM ubuntu:22.04

# 设置环境变量
ENV DEBIAN_FRONTEND=noninteractive

# 执行命令（安装软件等）
RUN apt-get update && apt-get install -y nginx

# 拷贝文件到镜像
COPY ./html /var/www/html

# 暴露端口（声明，不会实际发布端口）
EXPOSE 80

# 容器启动时执行的命令
CMD ["nginx", "-g", "daemon off;"]
```

### 2.2 常用指令详解

#### FROM —— 指定基础镜像

```dockerfile
# 使用官方镜像作为基础
FROM nginx:latest

# 使用多阶段构建时，可以给阶段命名
FROM node:20 AS builder
# ... 构建步骤 ...

FROM nginx:latest
# ... 运行步骤 ...

# 使用最小化基础镜像（减小镜像体积）
FROM alpine:3.19
FROM scratch    # 空镜像，适合静态编译的 Go 程序
```

#### RUN —— 执行命令

```dockerfile
# Shell 格式（通过 /bin/sh -c 执行）
RUN apt-get update && apt-get install -y curl

# Exec 格式（直接执行，不经过 shell）
RUN ["apt-get", "update"]

# 最佳实践：合并多条 RUN 减少镜像层数
# ✅ 推荐：一条 RUN 搞定，最后清理缓存
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        vim \
        git && \
    rm -rf /var/lib/apt/lists/*

# ❌ 不推荐：每条 RUN 产生一个新层
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y vim
```

#### COPY 与 ADD —— 拷贝文件

```dockerfile
# COPY：将文件从构建上下文复制到镜像（推荐使用）
COPY app.py /app/app.py
COPY . /app/
COPY --chown=www-data:www-data ./src /app/src    # 指定文件所有者
COPY --chmod=755 ./start.sh /app/start.sh         # 指定文件权限（需要 BuildKit）

# ADD：比 COPY 多了两个功能
# 1. 自动解压 tar 文件
ADD archive.tar.gz /app/
# 2. 支持从 URL 下载文件
ADD https://example.com/file.txt /app/

# 最佳实践：优先使用 COPY，只在需要解压或下载时用 ADD
```

#### WORKDIR —— 设置工作目录

```dockerfile
# 设置后续指令的工作目录
WORKDIR /app

# 后续的 RUN、CMD、COPY 等都基于这个目录
COPY . .              # 拷贝到 /app/
RUN pip install -r requirements.txt  # 在 /app/ 下执行

# 可以连续使用（相对路径基于上一级 WORKDIR）
WORKDIR /app
WORKDIR src          # 实际变为 /app/src
```

#### ENV 与 ARG —— 环境变量

```dockerfile
# ENV：设置运行时环境变量（容器运行时也可用）
ENV NODE_VERSION=20
ENV APP_HOME=/app
WORKDIR $APP_HOME

# ARG：设置构建时变量（只构建时可用，不会留到运行时）
ARG VERSION=latest
FROM node:${VERSION}

# ARG 可以在构建时覆盖
# docker build --build-arg VERSION=20 .
ARG BUILD_ENV=production
RUN if [ "$BUILD_ENV" = "production" ]; then echo "prod build"; fi
```

#### EXPOSE —— 声明端口

```dockerfile
# 声明容器监听的端口（仅文档作用，不会实际发布）
EXPOSE 80
EXPOSE 443
EXPOSE 8080/tcp      # 可以指定协议（默认 tcp）

# 实际端口映射需要在 docker run 时用 -p 参数指定
```

#### CMD 与 ENTRYPOINT —— 启动命令

```dockerfile
# CMD：容器启动时的默认命令（可以被 docker run 的参数覆盖）
# Exec 格式（推荐，直接执行，能接收信号）
CMD ["nginx", "-g", "daemon off;"]

# Shell 格式
CMD nginx -g "daemon off;"

# ENTRYPOINT：入口点（不会被覆盖，docker run 的参数会追加到后面）
ENTRYPOINT ["python", "app.py"]
# docker run myimage --port 8080
# 实际执行：python app.py --port 8080

# ENTRYPOINT + CMD 配合使用
# ENTRYPOINT 提供不可变的可执行文件
# CMD 提供默认参数
ENTRYPOINT ["python"]
CMD ["app.py"]
# docker run myimage          → 执行 python app.py
# docker run myimage server.py → 执行 python server.py
```

#### VOLUME 与 USER

```dockerfile
# VOLUME：声明数据卷挂载点
VOLUME ["/data", "/var/log"]

# USER：指定运行后续命令的用户（安全最佳实践）
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser
USER appuser
```

#### HEALTHCHECK —— 健康检查

```dockerfile
# 配置健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# 参数说明：
# --interval=30s    每 30 秒检查一次
# --timeout=3s      超时时间 3 秒
# --start-period=5s 容器启动后 5 秒开始检查
# --retries=3       连续失败 3 次标记为 unhealthy

# 禁用健康检查
HEALTHCHECK NONE
```

### 2.3 多阶段构建

多阶段构建用于在一个 Dockerfile 中使用多个 `FROM` 指令，最终只保留需要的部分，大幅减小镜像体积。

```dockerfile
# ===== 阶段 1：构建阶段 =====
FROM node:20-alpine AS builder

WORKDIR /app

# 先拷贝依赖文件（利用缓存，依赖不变时跳过安装）
COPY package.json package-lock.json ./
RUN npm ci

# 拷贝源码并构建
COPY . .
RUN npm run build

# ===== 阶段 2：运行阶段 =====
FROM nginx:alpine

# 只从构建阶段拷贝产物（不包含 node_modules、源码等）
COPY --from=builder /app/dist /usr/share/nginx/html

# 拷贝 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**构建并运行：**

```bash
# 构建镜像
docker build -t my-frontend:v1.0 .

# 查看镜像大小（多阶段构建后通常只有几十 MB）
docker images my-frontend:v1.0

# 运行容器
docker run -d -p 8080:80 --name frontend my-frontend:v1.0
```

### 2.4 最佳实践

```dockerfile
# syntax=docker/dockerfile:1

# 1. 选择最小化的基础镜像
FROM python:3.12-slim AS base

# 2. 设置合理的元数据
LABEL maintainer="your-email@example.com"
LABEL description="My Application"
LABEL version="1.0"

# 3. 合并 RUN 指令并清理缓存
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        gcc && \
    rm -rf /var/lib/apt/lists/*

# 4. 使用 .dockerignore 排除不需要的文件
# （.dockerignore 文件内容示例）
# .git
# node_modules
# __pycache__
# *.md
# .env

# 5. 利用构建缓存：先拷贝依赖文件，再拷贝源码
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# 6. 使用非 root 用户运行
RUN useradd --create-home appuser
USER appuser

# 7. 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8000/health || exit 1

# 8. 明确指定端口
EXPOSE 8000

# 9. 使用 CMD 而非 ENTRYPOINT（更灵活）
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

### 2.5 实战案例

#### 案例 1：Python Flask 应用

**项目结构：**
```
flask-app/
├── app.py
├── requirements.txt
├── Dockerfile
└── .dockerignore
```

**app.py：**
```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def hello():
    return jsonify({"message": "Hello from Docker!", "status": "ok"})

@app.route("/health")
def health():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

**requirements.txt：**
```
flask==3.1.0
gunicorn==23.0.0
```

**Dockerfile（入门版）：**

> 如果你是 Docker 新手，先用这个简化版本理解每条指令的作用。

```dockerfile
# 使用 Python 3.12 的精简版镜像作为基础
# slim 变体只包含 Python 运行所需的最少系统工具，体积约 150MB
# 对比：python:3.12 完整版约 1GB，alpine 版约 50MB 但可能有兼容问题
FROM python:3.12-slim

# 设置工作目录为 /app
# 后续的 RUN、COPY、CMD 等指令都会在这个目录下执行
# 如果 /app 不存在，Docker 会自动创建
WORKDIR /app

# 先只拷贝依赖清单文件（而不是整个项目）
# 原因：Docker 构建是分层的，每一层都有缓存
# 只要 requirements.txt 没变，这一层的缓存就可以复用，不用重新下载依赖
# 如果直接 COPY . . 然后再 pip install，每次改一行代码都要重新安装所有依赖
COPY requirements.txt .

# 安装 Python 依赖包
# --no-cache-dir：不缓存下载的包文件，减小镜像体积（安装完就不需要缓存了）
RUN pip install --no-cache-dir -r requirements.txt

# 拷贝项目的所有源代码到容器的 /app 目录
# 注意：这一步放在 pip install 之后，就是为了利用上面说的缓存机制
COPY . .

# 声明容器对外提供服务使用的端口
# 这只是一个"文档说明"，并不会自动发布端口
# 实际映射还需要在 docker run 时用 -p 参数指定，例如 -p 5000:5000
EXPOSE 5000

# 容器启动时执行的默认命令
# 使用 gunicorn（生产级 WSGI 服务器）而不是 Flask 自带的开发服务器
# --bind 0.0.0.0:5000：监听所有网卡的 5000 端口（不指定 0.0.0.0 则只能容器内访问）
# --workers 2：启动 2 个工作进程（一般设为 CPU 核心数 × 2 + 1）
# app:app：加载 app.py 文件中的 app 变量（Flask 实例）
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "app:app"]
```

**Dockerfile（生产版）：**

> 在入门版基础上增加了：多阶段构建、非 root 用户、健康检查。适合实际部署。

```dockerfile
# 启用 BuildKit 语法，获得更好的缓存和构建特性
# syntax=docker/dockerfile:1

# ===================================================================
# 第一阶段：构建阶段（名称为 builder）
# 目的：在这里安装编译工具和依赖，最终只把安装结果带到下一阶段
# 好处：最终的镜像不包含 gcc 等编译工具，体积更小、更安全
# ===================================================================
FROM python:3.12-slim AS builder

# 设置工作目录
WORKDIR /app

# 安装 gcc 编译器
# 为什么需要？某些 Python 包（如 psycopg2、cffi）包含 C 扩展，需要编译
# --no-install-recommends：不安装推荐的额外包，保持最小化
# rm -rf /var/lib/apt/lists/*：安装完立即清理 apt 缓存，减小这一层的体积
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    rm -rf /var/lib/apt/lists/*

# 拷贝依赖清单
COPY requirements.txt .

# 将 Python 包安装到 /install 目录（而不是默认的系统目录）
# --prefix=/install：指定安装到自定义路径，方便后续只拷贝这个目录到最终镜像
# 这样最终镜像里完全没有 gcc、apt 缓存等构建工具
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ===================================================================
# 第二阶段：运行阶段（这才是最终的镜像）
# 从全新的基础镜像开始，只拷贝需要的东西
# ===================================================================
FROM python:3.12-slim

# 设置工作目录
WORKDIR /app

# 从 builder 阶段拷贝已编译好的 Python 依赖到系统路径
# --from=builder：指定从哪个构建阶段拷贝
# /install 目录下的文件会被合并到 /usr/local 中
COPY --from=builder /install /usr/local

# 创建一个普通用户来运行应用（安全最佳实践）
# 默认容器以 root 用户运行，如果应用被攻破，攻击者拥有 root 权限
# --create-home：同时创建用户的主目录 /home/appuser
RUN useradd --create-home appuser

# 切换到非 root 用户
# 之后的所有操作（COPY、RUN、CMD）都以 appuser 身份执行
USER appuser

# 拷贝应用代码到容器
# --chown=appuser:appuser：将文件所有者设为 appuser（因为现在以 appuser 身份运行）
COPY --chown=appuser:appuser . .

# 声明服务端口
EXPOSE 5000

# 健康检查：Docker 会定期执行这个命令来判断容器是否正常
# --interval=30s：每 30 秒检查一次
# --timeout=3s：单次检查超过 3 秒视为失败
# --retries=3：连续失败 3 次才标记为 unhealthy
# 检查方式：用 Python 访问健康检查接口，成功则返回 0（健康）
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')" || exit 1

# 启动命令
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "app:app"]
```

> 💡 **如何选择？**
> - **学习阶段**：使用入门版，文件更短、更容易理解
> - **部署到生产**：使用生产版，镜像更小（不含编译工具）、更安全（非 root 用户）
> - 两个版本的 `app.py`、`requirements.txt`、构建命令完全相同

**.dockerignore：**
```
__pycache__
*.pyc
.git
.env
*.md
```

**构建与运行：**
```bash
# 构建镜像
docker build -t flask-app:v1.0 .

# 运行容器
docker run -d \
  --name flask-app \
  -p 5000:5000 \
  --restart unless-stopped \
  flask-app:v1.0

# 测试
curl http://localhost:5000
# 输出：{"message":"Hello from Docker!","status":"ok"}
```

#### 案例 2：Go 应用（使用 scratch 空镜像）

```dockerfile
# syntax=docker/dockerfile:1

# 构建阶段
FROM golang:1.22-alpine AS builder

WORKDIR /app

# 利用缓存先下载依赖
COPY go.mod go.sum ./
RUN go mod download

# 拷贝源码并编译
COPY . .
# 静态编译，不依赖 C 库
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app-server .

# 运行阶段：使用 scratch 空镜像（最终镜像可能只有几 MB）
FROM scratch

# 从构建阶段只拷贝编译好的二进制文件
COPY --from=builder /app-server /app-server

# 拷贝 CA 证书（如果需要 HTTPS 请求）
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

EXPOSE 8080

ENTRYPOINT ["/app-server"]
```

---

## 第三部分：Docker Compose

### 3.1 Compose 基础

Docker Compose 是一个用于定义和运行**多容器**应用的工具。

**为什么需要 Compose？** 想象你要部署一个 Web 应用，它需要：
- 一个 Nginx 做反向代理
- 一个 Node.js/Python 后端服务
- 一个 PostgreSQL 数据库
- 一个 Redis 缓存

如果用 `docker run` 手动启动，你需要记住很长的命令、正确的启动顺序、网络配置等。而 Docker Compose 让你把所有这些写在一个 `compose.yaml` 文件里，一条命令就能全部启动。

```bash
# 没有 Compose 时，你需要这样手动启动每个容器：
docker run -d --name nginx -p 80:80 -v ./nginx.conf:/etc/nginx/nginx.conf:ro nginx
docker run -d --name postgres -e POSTGRES_PASSWORD=xxx -v db-data:/var/lib/postgresql/data postgres
docker run -d --name redis redis
docker run -d --name webapp -p 8080:8080 --link nginx --link postgres --link redis my-webapp

# 有了 Compose，只需要：
docker compose up -d    # 一条命令搞定！
```

**Docker Compose V2/V5** 现在已集成到 Docker CLI 中，使用 `docker compose`（没有横线）命令。

```bash
# 推荐命令格式（V2/V5，安装 Docker 时自带）
docker compose up -d

# 旧版命令格式（V1，已弃用，需要单独用 pip 安装）
docker-compose up -d
```

> 💡 **怎么确认你的版本？** 运行 `docker compose version`，如果能输出版本号（如 `Docker Compose version v2.32.x` 或 `v5.x.x`），说明已经安装好了。

**核心概念速览：**

| 概念       | 说明                 | 类比                             |
| ---------- | -------------------- | -------------------------------- |
| `services` | 定义各个容器（应用） | 相当于多个 `docker run`          |
| `volumes`  | 数据持久化存储       | 相当于 `-v` 参数                 |
| `networks` | 容器间的网络通信     | 相当于 `--network` 参数          |
| `.env`     | 环境变量文件         | 敏感信息（密码等）不写进配置文件 |

### 3.2 compose.yaml 详解

#### 基本结构

一个 `compose.yaml` 文件由三个顶级部分组成：

```yaml
# Docker Compose 配置文件
# 推荐文件名（按优先级排列）：
#   compose.yaml     ← 官方推荐的首选文件名
#   compose.yml      ← 也可以
#   docker-compose.yaml  ← 向后兼容（旧版本遗留习惯）
#   docker-compose.yml   ← 向后兼容（旧版本遗留习惯）
#
# 如果同时存在 compose.yaml 和 docker-compose.yml，
# Compose 会优先使用 compose.yaml

# services：定义各个服务（容器）—— 这是唯一必填的部分
services:
  webapp:           # 服务名（可以自定义，其他服务用这个名字访问它）
    image: nginx    # 使用哪个镜像
    ports:
      - "80:80"     # 端口映射：宿主机端口:容器端口

  database:         # 另一个服务
    image: postgres
    environment:
      POSTGRES_PASSWORD: mypass

# volumes：定义数据卷（可选）
# 用于数据持久化，容器删除后数据不会丢失
volumes:
  db-data:          # 定义一个命名卷

# networks：定义网络（可选）
# 不写的话 Compose 会自动创建一个默认网络
networks:
  app-network:      # 定义一个自定义网络
```

> 💡 **小白提示**：
> - 最简单的 Compose 文件只需要 `services` 部分，`volumes` 和 `networks` 都是可选的
> - **文件名怎么选？** 新项目推荐使用 `compose.yaml`（官方首选）；但在网上看到的教程和开源项目中，`docker-compose.yml` 更常见（历史遗留习惯），两者都能正常工作
> - **不需要 `version` 字段了**：旧教程中常见的 `version: "3.8"` 已经过时。Docker Compose V2/V5 使用统一的 Compose Specification，自动忽略 `version` 字段

#### 最简入门示例

> 在看完整示例之前，先用这个最简单的配置体验一下 Compose 的工作流程。

```yaml
# compose.yaml —— 最简单的 Compose 文件
# 只有一个 Nginx 服务，用于展示静态网页
services:
  web:
    image: nginx:alpine              # 使用 Nginx 轻量镜像
    ports:
      - "8080:80"                    # 宿主机 8080 端口 → 容器 80 端口
    volumes:
      - ./html:/usr/share/nginx/html # 把本地 html 目录挂载到容器中
```

```bash
# 1. 创建 html 目录和测试页面
mkdir html
echo "<h1>Hello from Docker Compose!</h1>" > html/index.html

# 2. 启动服务
docker compose up -d

# 3. 访问测试
curl http://localhost:8080
# 输出：<h1>Hello from Docker Compose!</h1>

# 4. 查看运行状态
docker compose ps

# 5. 停止并删除
docker compose down
```

> 💡 **恭喜！** 如果上面的命令都成功执行了，说明你已经掌握了 Compose 的基本用法。下面的完整示例只是在服务数量和配置项上更加丰富。

#### 完整示例：Web 应用 + 数据库 + 缓存

```yaml
services:
  # ===== Nginx 反向代理 =====
  nginx:
    image: nginx:1.27-alpine
    container_name: my-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro     # 配置文件（只读）
      - ./nginx/conf.d:/etc/nginx/conf.d:ro             # 虚拟主机配置
      - web-html:/usr/share/nginx/html                   # 网页文件
      - nginx-logs:/var/log/nginx                        # 日志
    depends_on:
      webapp:
        condition: service_healthy                       # 等待 webapp 健康再启动
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3

  # ===== Web 应用 =====
  webapp:
    build:
      context: ./webapp                    # 构建上下文目录
      dockerfile: Dockerfile               # Dockerfile 文件名
      args:                                # 构建参数
        NODE_ENV: production
    container_name: my-webapp
    environment:
      - DATABASE_URL=postgresql://appuser:apppass@database:5432/appdb
      - REDIS_URL=redis://cache:6379/0
      - SECRET_KEY=${SECRET_KEY}           # 从 .env 文件读取
    volumes:
      - ./webapp/uploads:/app/uploads      # 用户上传目录
    depends_on:
      database:
        condition: service_healthy
      cache:
        condition: service_started
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

  # ===== PostgreSQL 数据库 =====
  database:
    image: postgres:16-alpine
    container_name: my-postgres
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: apppass
      POSTGRES_DB: appdb
    volumes:
      - db-data:/var/lib/postgresql/data    # 数据持久化
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro  # 初始化脚本
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ===== Redis 缓存 =====
  cache:
    image: redis:7-alpine
    container_name: my-redis
    command: redis-server --requirepass ${REDIS_PASSWORD:-redispass}
    volumes:
      - redis-data:/data
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

# ===== 数据卷定义 =====
volumes:
  db-data:
    driver: local
  redis-data:
    driver: local
  web-html:
    driver: local
  nginx-logs:
    driver: local

# ===== 网络定义 =====
networks:
  app-network:
    driver: bridge
```

**对应的 `.env` 文件：**
```bash
# .env 文件（不要提交到 Git）
SECRET_KEY=your-super-secret-key-change-me
REDIS_PASSWORD=redispass
```

#### 常用服务配置项说明

```yaml
services:
  example:
    # ---- 镜像与构建 ----
    image: nginx:latest                    # 使用已有镜像
    # 或者使用 build 构建
    build:
      context: .                           # 构建上下文路径
      dockerfile: Dockerfile.prod          # 指定 Dockerfile
      args:                                # 构建参数
        VERSION: "1.0"
      target: production                   # 多阶段构建的目标阶段
      cache_from:                          # 缓存来源
        - myapp:latest

    # ---- 容器基本配置 ----
    container_name: my-container           # 容器名称
    hostname: myapp                        # 容器内主机名
    restart: unless-stopped                # 重启策略
    platform: linux/amd64                  # 指定平台

    # ---- 端口 ----
    ports:
      - "8080:80"                          # 宿主机:容器
      - "127.0.0.1:3000:3000"              # 限制监听地址
      - "9090:9090/udp"                    # 指定协议

    # ---- 环境变量 ----
    environment:
      - KEY=value                          # 列表格式
      - ANOTHER_KEY=${HOST_VAR}            # 引用宿主机变量
    # 或者使用映射格式
    env_file:
      - .env                               # 从文件加载
      - .env.local

    # ---- 数据卷 ----
    volumes:
      - /host/path:/container/path         # 绑定挂载
      - volume-name:/container/path        # 命名卷
      - ./relative:/container/path         # 相对路径
      - /container/path                    # 匿名卷

    # ---- 网络 ----
    networks:
      - frontend
      - backend
    extra_hosts:                           # 添加 hosts 映射
      - "myhost.local:192.168.1.100"

    # ---- 依赖关系 ----
    depends_on:
      db:
        condition: service_healthy         # 依赖条件
      redis:
        condition: service_started

    # ---- 资源限制 ----
    deploy:
      resources:
        limits:
          cpus: "0.5"                      # 最多使用 0.5 个 CPU
          memory: 512M                     # 最多使用 512MB 内存
        reservations:
          cpus: "0.25"                     # 预留 0.25 个 CPU
          memory: 256M                     # 预留 256MB 内存

    # ---- 健康检查 ----
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 10s

    # ---- 日志配置 ----
    logging:
      driver: json-file
      options:
        max-size: "10m"                    # 单个日志文件最大 10MB
        max-file: "3"                      # 最多保留 3 个日志文件

    # ---- 安全 ----
    security_opt:
      - no-new-privileges:true             # 禁止提权
    read_only: true                        # 只读根文件系统
    tmpfs:
      - /tmp                               # 需要写入的目录用 tmpfs
```

#### 网络配置详解

Docker Compose 的网络配置是多容器通信的核心。理解网络的几种模式，能帮你解决大部分服务互联问题。

**为什么需要关心网络？**

默认情况下，Compose 会为你的项目创建一个网络，所有服务都加入这个网络，服务之间可以用**服务名**互相访问。但在实际使用中，你经常需要更灵活的网络配置。

```yaml
# 默认行为：Compose 自动创建一个网络，名为 "项目名_default"
# 服务之间可以直接用服务名访问，比如 webapp 可以访问 database:5432
services:
  webapp:
    image: nginx
    # 不指定 networks 时，自动加入默认网络
  database:
    image: postgres
    # 同上
```

**1. 自定义网络（最常用）**

```yaml
# 手动定义网络，可以控制网络名称和驱动类型
services:
  frontend:
    image: nginx
    networks:
      - frontend-net       # 只能和同网络的服务通信

  backend:
    image: node
    networks:
      - frontend-net       # 可以被 frontend 访问
      - backend-net        # 也可以和数据库通信

  database:
    image: postgres
    networks:
      - backend-net        # 只有 backend 能访问数据库

networks:
  frontend-net:            # 前端网络
    driver: bridge
  backend-net:             # 后端网络（隔离数据库，不让前端直接访问）
    driver: bridge
```

> 💡 **小白提示**：上面的配置实现了**网络隔离**——frontend 无法直接访问 database，必须通过 backend 中转。这是生产环境中常见的安全实践。

**2. 外部网络（external）—— 跨项目通信**

当你的多个 Compose 项目需要互相通信时，就需要用到外部网络。

```yaml
# 项目 A：API 服务（compose.yaml）
services:
  api:
    image: my-api
    networks:
      - shared-network

networks:
  shared-network:
    # external: true 表示这个网络不是由本项目创建的
    # 而是使用 Docker 中已经存在的网络
    # 如果网络不存在，启动时会报错
    external: true
    name: my-shared-net    # 指定 Docker 中的实际网络名称
    # 如果不写 name，则使用键名 "shared-network" 作为 Docker 网络名
```

```yaml
# 项目 B：前端服务（compose.yaml）
services:
  web:
    image: my-web
    networks:
      - shared-network
    # 在 web 容器内，可以用 "api" 这个服务名访问项目 A 的服务
    # 因为它们在同一个网络中

networks:
  shared-network:
    external: true
    name: my-shared-net    # 名称要和项目 A 中指定的一致
```

```bash
# 使用前，先手动创建外部网络
docker network create my-shared-net

# 然后分别启动两个项目
cd project-a && docker compose up -d
cd project-b && docker compose up -d

# 现在两个项目的容器可以互相通信了
```

> ⚠️ **注意**：`external: true` 意味着这个网络必须**事先存在**。如果网络不存在，`docker compose up` 会报错。当你执行 `docker compose down` 时，外部网络**不会被删除**（因为它不属于这个项目）。

**3. 网络别名（aliases）**

在同一个网络中，可以给服务起别名，其他服务可以用别名来访问它。

```yaml
services:
  database:
    image: postgres:16
    networks:
      app-network:
        aliases:
          - db              # 其他服务可以用 "db" 访问
          - postgres        # 也可以用 "postgres" 访问
          - database        # 服务名本身也能用

  webapp:
    image: node
    networks:
      - app-network
    environment:
      # 以下三种写法都能连接到 database 服务
      - DB_HOST=database    # 使用服务名
      # - DB_HOST=db        # 使用别名
      # - DB_HOST=postgres  # 使用别名

networks:
  app-network:
```

> 💡 **什么时候用别名？** 当你的应用配置中硬编码了数据库地址（比如写死了 `db` 或 `postgres`），不想改代码时，可以用别名来适配。

#### 数据卷配置详解

数据卷（Volumes）是容器数据持久化的关键。新手最容易犯的错误就是没有挂载数据卷，导致容器重建后数据丢失。

**三种挂载方式对比：**

| 方式     | 语法                          | 特点                                           | 适用场景                   |
| -------- | ----------------------------- | ---------------------------------------------- | -------------------------- |
| 命名卷   | `volume-name:/container/path` | 由 Docker 管理，数据持久保存在 Docker 内部目录 | 数据库数据、应用持久化数据 |
| 绑定挂载 | `./host/path:/container/path` | 直接映射宿主机目录，双向同步                   | 开发时源码热重载、配置文件 |
| 匿名卷   | `/container/path`             | 无名称，容器删除后可能丢失                     | 临时数据                   |

**1. 命名卷（Named Volumes）**

```yaml
services:
  database:
    image: postgres:16
    volumes:
      - db-data:/var/lib/postgresql/data    # 命名卷：数据持久化

volumes:
  db-data:
    # 默认使用 local 驱动，数据存在 Docker 管理的目录中
    # 在 Linux 上通常是 /var/lib/docker/volumes/项目名_db-data/_data
    driver: local
```

```bash
# 查看所有数据卷
docker volume ls

# 查看某个数据卷的详细信息（可以看到实际存储路径）
docker volume inspect 01-docker_db-data

# 删除未使用的数据卷（⚠️ 确认不再需要后再操作）
docker volume prune
```

**2. 外部数据卷（external）**

和外部网络类似，有些数据卷需要在多个 Compose 项目之间共享，或者由外部系统管理。

```yaml
services:
  database:
    image: postgres:16
    volumes:
      - shared-data:/var/lib/postgresql/data

volumes:
  shared-data:
    # external: true 表示这个卷已经存在，不是由本项目创建的
    # 适合在多个项目间共享数据，或者数据由备份恢复脚本预先创建
    external: true
    name: my-shared-db-volume    # 指定外部卷的名称
```

```bash
# 使用前，先手动创建外部卷
docker volume create my-shared-db-volume

# 启动项目
docker compose up -d

# external 卷在 docker compose down 时不会被删除
```

**3. 绑定挂载的注意事项**

```yaml
services:
  webapp:
    image: nginx
    volumes:
      # 绑定挂载：宿主机目录直接映射到容器内
      - ./nginx.conf:/etc/nginx/nginx.conf:ro    # :ro 表示只读，容器不能修改
      - ./html:/usr/share/nginx/html              # 可读写
      - ./logs:/var/log/nginx                     # 日志输出到宿主机
```

> ⚠️ **绑定挂载的常见坑：**
> 1. **宿主机路径必须存在**：如果是挂载文件，文件必须事先存在；否则 Docker 会把它当作目录创建
> 2. **权限问题**：容器内的用户权限和宿主机可能不一致，可能导致读写报错
> 3. **不要挂载整个系统目录**：比如 `/:/host` 这样的挂载很危险

**4. 绑定挂载 vs 命名卷：怎么选？**

```
开发环境：
  ✅ 绑定挂载（方便修改代码，实时生效）
  ✅ 配置文件用绑定挂载 + :ro（只读，防止容器修改配置）

生产环境：
  ✅ 命名卷（数据由 Docker 统一管理，方便备份和迁移）
  ✅ 配置文件可以用绑定挂载，但注意权限
```

#### 环境变量详解

环境变量是配置容器化应用最常用的方式。Compose 提供了多种设置环境变量的方法。

**1. `environment` 直接设置**

```yaml
services:
  webapp:
    environment:
      # 方式一：映射格式（推荐，更清晰）
      DATABASE_URL: postgresql://user:pass@db:5432/mydb
      REDIS_URL: redis://cache:6379/0
      DEBUG: "false"

      # 方式二：列表格式
      # - DATABASE_URL=postgresql://user:pass@db:5432/mydb
      # - REDIS_URL=redis://cache:6379/0
```

**2. `env_file` 从文件加载**

当你有很多环境变量，或者不同环境（开发/生产）使用不同变量时，用 `.env` 文件更方便。

```yaml
services:
  webapp:
    # 从文件加载环境变量，文件中每行一个 KEY=VALUE
    env_file:
      - .env                    # 基础配置
      - .env.local              # 本地覆盖配置（不提交到 Git）
```

```bash
# .env 文件示例
DATABASE_URL=postgresql://user:pass@db:5432/mydb
REDIS_URL=redis://cache:6379/0
SECRET_KEY=my-secret-key
DEBUG=false
```

**3. 变量插值和默认值**

```yaml
services:
  database:
    image: postgres:16
    environment:
      # ${变量名} 从 .env 文件或宿主机环境变量读取
      POSTGRES_USER: ${DB_USER}

      # :- 设置默认值：如果 DB_PASSWORD 未设置，则使用 "defaultpass"
      POSTGRES_PASSWORD: ${DB_PASSWORD:-defaultpass}

      # :? 报错退出：如果 DB_NAME 未设置，启动时报错并显示提示信息
      POSTGRES_DB: ${DB_NAME:?请在 .env 文件中设置 DB_NAME}
```

**4. `.env` 文件 vs `env_file` 的区别（容易混淆！）**

| 特性     | `.env`（项目根目录）                          | `env_file`（服务配置）                      |
| -------- | --------------------------------------------- | ------------------------------------------- |
| 作用     | 在 `compose.yaml` 中用于**变量插值** `${VAR}` | 将变量注入到**容器内部**                    |
| 位置     | 放在项目根目录，自动加载                      | 在 `services.xxx.env_file` 中指定路径       |
| 作用范围 | 整个 Compose 文件                             | 只对指定的服务生效                          |
| 使用场景 | 设置 Compose 层面的变量（镜像版本、端口映射） | 给应用传递运行时配置（数据库密码、API Key） |

```yaml
# .env 文件（项目根目录，用于 compose.yaml 中的变量插值）
POSTGRES_VERSION=16
HOST_PORT=5432
DB_PASSWORD=mysecretpassword

---
# compose.yaml
services:
  database:
    image: postgres:${POSTGRES_VERSION}    # 使用 .env 中的变量
    ports:
      - "${HOST_PORT}:5432"                # 使用 .env 中的变量
    env_file:
      - db.env                             # db.env 中的变量会注入容器内部
```

```bash
# db.env（专门给数据库容器用的环境变量）
POSTGRES_USER=appuser
POSTGRES_PASSWORD=mysecretpassword
POSTGRES_DB=appdb
```

#### entrypoint 和 command 的区别

这两个配置项都和"容器启动时执行什么命令"有关，但行为不同，新手经常搞混。

| 配置项       | 作用                                     | 类比                       |
| ------------ | ---------------------------------------- | -------------------------- |
| `entrypoint` | 容器启动时**固定执行**的程序             | 比如总解释器 `/bin/python` |
| `command`    | 传给 entrypoint 的**参数**（或覆盖 CMD） | 比如脚本名 `app.py`        |

```yaml
services:
  # 示例 1：用 command 覆盖默认命令
  webapp:
    image: node:20
    # 镜像默认执行的是 node，这里覆盖为 npm start
    command: npm start

  # 示例 2：entrypoint + command 配合使用
  app:
    image: python:3.12
    entrypoint: ["python"]           # 固定用 python 解释器
    command: ["app.py"]              # 执行 python app.py

  # 示例 3：覆盖镜像自带的 entrypoint
  debug:
    image: my-app
    # 完全替换镜像中的 entrypoint 和 command，进入调试模式
    entrypoint: ["sh", "-c"]
    command: ["sleep 3600"]
```

> 💡 **简单记忆**：`entrypoint` 是"执行器"，`command` 是"参数"。大多数情况下你只需要设置 `command` 就够了。

#### profiles：按场景启动服务

当你有一组服务只在特定场景下使用（比如测试工具、数据库管理界面），可以用 `profiles` 来控制它们默认不启动。

```yaml
services:
  # 默认启动的服务（没有 profiles）
  webapp:
    image: nginx
    ports:
      - "80:80"

  database:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: devpass

  # 带有 profiles 的服务：默认不会启动
  adminer:
    image: adminer
    ports:
      - "8888:8080"
    profiles:
      - debug          # 属于 debug 配置
    depends_on:
      - database

  pgadmin:
    image: dpage/pgadmin4
    ports:
      - "5050:80"
    profiles:
      - debug          # 也属于 debug 配置
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin

  test-runner:
    image: node:20
    profiles:
      - test           # 属于 test 配置
    command: npm test
```

```bash
# 默认启动：只启动 webapp 和 database
docker compose up -d

# 启用 debug 配置：额外启动 adminer 和 pgadmin
docker compose --profile debug up -d

# 启用 test 配置：额外启动 test-runner
docker compose --profile test up -d

# 同时启用多个 profile
docker compose --profile debug --profile test up -d
```

> 💡 **典型用法**：开发时 `--profile debug` 启动管理工具，生产环境不加 profile 只启动核心服务。

#### 多环境配置（Override 与多文件合并）

在实际开发中，你的开发环境和生产环境通常需要不同的配置。Docker Compose 提供了几种方式来管理多环境配置。

**方式一：自动合并 `compose.override.yaml`**

Docker Compose 在启动时会自动查找并合并两个文件：

```
compose.yaml             # 基础配置（必须存在）
compose.override.yaml    # 覆盖配置（可选，自动合并）
```

```yaml
# compose.yaml —— 基础配置（开发和生产共用）
services:
  webapp:
    image: my-webapp
    ports:
      - "80:80"
    environment:
      - APP_ENV=production
```

```yaml
# compose.override.yaml —— 开发环境覆盖（自动合并，不要提交到 Git）
services:
  webapp:
    # 覆盖 command，使用开发服务器
    command: npm run dev
    # 追加端口映射（开发时暴露调试端口）
    ports:
      - "80:80"
      - "9229:9229"    # Node.js 调试端口
    # 追加卷挂载（源码热重载）
    volumes:
      - ./src:/app/src
    # 覆盖环境变量
    environment:
      - APP_ENV=development
      - DEBUG=true
```

```bash
# 在开发机上：自动合并 compose.yaml + compose.override.yaml
docker compose up -d

# 如果不想合并 override 文件，可以显式指定文件
docker compose -f compose.yaml up -d
```

**方式二：使用多个 `-f` 文件**

```bash
# 开发环境：基础 + 开发覆盖
docker compose -f compose.yaml -f compose.dev.yaml up -d

# 生产环境：只用基础配置
docker compose -f compose.yaml -f compose.prod.yaml up -d

# CI/CD 测试环境：基础 + 测试覆盖
docker compose -f compose.yaml -f compose.test.yaml up -d
```

```yaml
# compose.prod.yaml —— 生产环境专用配置
services:
  webapp:
    image: my-registry/my-webapp:v1.0    # 使用镜像仓库中的版本
    restart: always                       # 生产环境自动重启
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 1G
    logging:
      driver: json-file
      options:
        max-size: "50m"
        max-file: "5"
```

**方式三：使用 `.env` 文件切换环境**

```bash
# .env.dev —— 开发环境变量
COMPOSE_PROJECT_NAME=myapp-dev
APP_IMAGE_TAG=latest
HOST_PORT=8080

# .env.prod —— 生产环境变量
COMPOSE_PROJECT_NAME=myapp-prod
APP_IMAGE_TAG=v1.0.0
HOST_PORT=80
```

```yaml
# compose.yaml —— 使用变量实现环境差异
services:
  webapp:
    image: my-webapp:${APP_IMAGE_TAG}
    ports:
      - "${HOST_PORT}:80"
```

```bash
# 通过指定 env 文件切换环境
docker compose --env-file .env.dev up -d
docker compose --env-file .env.prod up -d
```

> 💡 **三种方式对比**：
> - **override 自动合并**：最方便，适合个人开发
> - **多 `-f` 文件**：最灵活，适合 CI/CD 流水线
> - **`.env` 文件**：适合只有少量配置差异的场景

### 3.3 常用命令

```bash
# ===== 构建与启动 =====

# 构建并启动所有服务（后台运行）
docker compose up -d

# 构建并启动（前台运行，能看到日志）
docker compose up

# 强制重新构建镜像
docker compose up -d --build

# 只启动指定服务（自动启动其依赖）
docker compose up -d nginx webapp

# 创建并启动（不启动已停止的服务）
docker compose create
docker compose start

# ===== 停止与删除 =====

# 停止所有服务（容器保留，可重新 start）
docker compose stop

# 停止并删除容器、网络
docker compose down

# 停止并删除容器、网络、数据卷（⚠️ 数据会丢失）
docker compose down -v

# 停止并删除容器、网络、镜像
docker compose down --rmi all

# ===== 查看状态 =====

# 查看所有服务状态
docker compose ps

# 查看服务日志
docker compose logs

# 跟踪特定服务日志
docker compose logs -f webapp

# 查看最后 50 行日志
docker compose logs --tail 50 webapp

# ===== 执行命令 =====

# 在运行中的服务容器内执行命令
docker compose exec webapp bash
docker compose exec database psql -U appuser -d appdb

# 一次性运行命令（创建新容器）
docker compose run --rm webapp python manage.py migrate

# ===== 扩缩容 =====

# 扩展服务到 3 个实例
docker compose up -d --scale webapp=3

# ===== 其他 =====

# 查看服务使用的镜像
docker compose images

# 重新构建服务镜像
docker compose build webapp

# 拉取服务镜像
docker compose pull

# 验证配置文件语法
docker compose config

# 查看服务进程
docker compose top
```

### 3.4 实战案例

#### 案例 1：WordPress 博客系统

```yaml
# compose.yaml —— WordPress + MySQL
services:
  wordpress:
    image: wordpress:6-php8.2-apache
    container_name: wordpress
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: database
      WORDPRESS_DB_USER: wp_user
      WORDPRESS_DB_PASSWORD: ${DB_PASSWORD:-wp_secure_pass}
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wp-content:/var/www/html/wp-content    # 插件、主题、上传文件
    depends_on:
      database:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - wp-network

  database:
    image: mysql:8.0
    container_name: wordpress-db
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-root_pass}
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wp_user
      MYSQL_PASSWORD: ${DB_PASSWORD:-wp_secure_pass}
    volumes:
      - db-data:/var/lib/mysql
    restart: unless-stopped
    networks:
      - wp-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  wp-content:
  db-data:

networks:
  wp-network:
```

```bash
# 启动 WordPress
docker compose up -d

# 访问 http://localhost:8080 进行 WordPress 安装
```

#### 案例 2：监控平台（Prometheus + Grafana）

```yaml
# compose.yaml —— 监控平台
services:
  prometheus:
    image: prom/prometheus:v3.1.0
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.retention.time=30d"
    networks:
      - monitoring
    restart: unless-stopped

  grafana:
    image: grafana/grafana:11.4.0
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD:-admin123}
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on:
      - prometheus
    networks:
      - monitoring
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:v1.8.2
    container_name: node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - "--path.procfs=/host/proc"
      - "--path.sysfs=/host/sys"
      - "--path.rootfs=/rootfs"
    networks:
      - monitoring
    restart: unless-stopped

volumes:
  prometheus-data:
  grafana-data:

networks:
  monitoring:
```

**prometheus/prometheus.yml：**
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "node-exporter"
    static_configs:
      - targets: ["node-exporter:9100"]

  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
```

```bash
# 启动监控平台
docker compose up -d

# 访问：
# Prometheus: http://localhost:9090
# Grafana:    http://localhost:3000 (admin / admin123)
# 指标:       http://localhost:9100/metrics
```

#### 案例 3：开发环境（热重载）

```yaml
# compose.yaml —— 开发环境
services:
  frontend:
    build:
      context: ./frontend
      target: development      # 使用 Dockerfile 中的 development 阶段
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src:cached    # 源码挂载，实现热重载
      - ./frontend/public:/app/public:cached
    environment:
      - CHOKIDAR_USEPOLLING=true           # Docker 中文件监听需要开启轮询
      - REACT_APP_API_URL=http://localhost:8080
    command: npm start                     # 覆盖 Dockerfile 中的 CMD

  backend:
    build:
      context: ./backend
      target: development
    ports:
      - "8080:8080"
    volumes:
      - ./backend:/app                     # 挂载整个后端代码
    environment:
      - DATABASE_URL=postgresql://dev:dev@database:5432/devdb
      - REDIS_URL=redis://cache:6379/0
      - FLASK_DEBUG=1
    depends_on:
      database:
        condition: service_healthy
      cache:
        condition: service_started

  database:
    image: postgres:16-alpine
    ports:
      - "5432:5432"                        # 开发时暴露端口便于调试
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: devdb
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./database/init-dev.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 5s
      timeout: 3s
      retries: 5

  cache:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes  # 开启 AOF 持久化

  adminer:
    image: adminer
    ports:
      - "8888:8080"                        # 数据库管理界面
    depends_on:
      - database
    restart: unless-stopped

volumes:
  db-data:
```

---

## 第四部分：常见操作指南（How-to）

> 本部分提供常见实际操作的场景化步骤指引。遇到具体问题时，可以直接找到对应章节按步骤操作。

### 4.1 如何清理 Docker 占用的磁盘空间

随着使用时间增长，Docker 会占用大量磁盘空间。以下是系统化清理的方法：

```bash
# 第 1 步：查看 Docker 当前磁盘占用
docker system df
# 输出示例：
# TYPE            TOTAL   ACTIVE  SIZE      RECLAIMABLE
# Images          15      5       3.5GB     2.1GB (60%)
# Containers      8       3       120MB     80MB (66%)
# Local Volumes   5       3       500MB     200MB (40%)
# Build Cache     20      0       1.2GB     1.2GB (100%)

# 第 2 步：一键清理所有未使用的资源（镜像、容器、网络、构建缓存）
docker system prune
# 确认后删除：已停止的容器、未使用的网络、悬挂镜像、构建缓存

# 第 3 步（彻底清理）：包括未使用的镜像和数据卷
docker system prune -a --volumes
# ⚠️ 这会删除所有未运行容器的镜像和数据卷，确保重要数据已备份

# 第 4 步：单独清理各类资源（精细控制）
docker image prune -a          # 删除所有未使用的镜像
docker container prune         # 删除所有已停止的容器
docker volume prune            # 删除所有未使用的数据卷
docker network prune           # 删除所有未使用的网络
docker builder prune           # 清理构建缓存
```

### 4.2 如何查看容器日志并定位问题

```bash
# 查看容器日志（最基本的调试手段）
docker logs my-container

# 实时跟踪日志输出
docker logs -f my-container

# 查看最后 100 行日志
docker logs --tail 100 my-container

# 查看指定时间范围的日志
docker logs --since "2024-01-15T10:00:00" my-container
docker logs --since 30m my-container          # 最近 30 分钟

# 同时查看多个容器的日志（使用 Docker Compose）
docker compose logs -f

# 只看某个服务的日志
docker compose logs -f webapp

# 将日志导出到文件分析
docker logs my-container > container.log 2>&1
```

### 4.3 如何将本地项目容器化并部署

```bash
# 第 1 步：在项目根目录创建 .dockerignore
cat > .dockerignore <<'EOF'
.git
node_modules
__pycache__
*.pyc
.env
*.md
.vscode
EOF

# 第 2 步：编写 Dockerfile（以 Node.js 项目为例）
cat > Dockerfile <<'EOF'
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
EOF

# 第 3 步：构建并测试
docker build -t my-app:v1.0 .
docker run -d -p 3000:3000 --name my-app my-app:v1.0
curl http://localhost:3000

# 第 4 步：验证无误后，推送到镜像仓库
docker tag my-app:v1.0 registry.example.com/my-app:v1.0
docker push registry.example.com/my-app:v1.0
```

### 4.4 如何在容器之间共享数据

```bash
# 方法 1：使用命名数据卷（推荐，由 Docker 管理）
docker volume create shared-data
docker run -d --name app-a -v shared-data:/data app-image-a
docker run -d --name app-b -v shared-data:/data app-image-b
# 两个容器共享 /data 目录

# 方法 2：使用绑定挂载（适合开发环境）
docker run -d --name app-a -v ./shared:/data app-image-a
docker run -d --name app-b -v ./shared:/data app-image-b

# 方法 3：使用 Docker Compose 定义共享卷
cat > compose.yaml <<'EOF'
services:
  producer:
    image: my-producer
    volumes:
      - shared-data:/output

  consumer:
    image: my-consumer
    volumes:
      - shared-data:/input
    depends_on:
      - producer

volumes:
  shared-data:
EOF
```

### 4.5 如何备份和恢复数据卷

```bash
# 备份数据卷到 tar 文件
docker run --rm \
  -v my-data-volume:/source:ro \
  -v $(pwd):/backup \
  alpine tar czf /backup/my-data-backup.tar.gz -C /source .

# 恢复数据卷
docker run --rm \
  -v my-data-volume:/target \
  -v $(pwd):/backup \
  alpine tar xzf /backup/my-data-backup.tar.gz -C /target

# Windows PowerShell 用户
docker run --rm -v my-data-volume:/source:ro -v ${PWD}:/backup alpine tar czf /backup/my-data-backup.tar.gz -C /source .
```

---

## 第五部分：命令速查表（Reference）

> 日常操作中最常用的 Docker 命令，按类别整理，方便快速查阅。

### 5.1 镜像操作

| 命令                              | 说明                   |
| --------------------------------- | ---------------------- |
| `docker images`                   | 列出本地所有镜像       |
| `docker pull <镜像>:<标签>`       | 拉取镜像               |
| `docker build -t <名称>:<标签> .` | 从 Dockerfile 构建镜像 |
| `docker rmi <镜像>`               | 删除镜像               |
| `docker tag <源> <目标>`          | 给镜像打标签           |
| `docker save -o file.tar <镜像>`  | 导出镜像为 tar 文件    |
| `docker load -i file.tar`         | 从 tar 文件导入镜像    |
| `docker image prune -a`           | 清理所有未使用的镜像   |
| `docker history <镜像>`           | 查看镜像构建历史       |
| `docker inspect <镜像>`           | 查看镜像详细信息       |

### 5.2 容器操作

| 命令                                                          | 说明                     |
| ------------------------------------------------------------- | ------------------------ |
| `docker run -d --name <名称> -p <宿主端口>:<容器端口> <镜像>` | 创建并后台运行容器       |
| `docker ps`                                                   | 查看运行中的容器         |
| `docker ps -a`                                                | 查看所有容器（含已停止） |
| `docker start <容器>`                                         | 启动已停止的容器         |
| `docker stop <容器>`                                          | 优雅停止容器             |
| `docker restart <容器>`                                       | 重启容器                 |
| `docker rm <容器>`                                            | 删除已停止的容器         |
| `docker rm -f <容器>`                                         | 强制删除运行中的容器     |
| `docker exec -it <容器> bash`                                 | 进入容器交互终端         |
| `docker logs -f <容器>`                                       | 实时查看容器日志         |
| `docker cp <容器>:<路径> <宿主路径>`                          | 从容器拷贝文件到宿主机   |
| `docker stats`                                                | 查看容器资源占用         |
| `docker inspect <容器>`                                       | 查看容器详细信息         |

### 5.3 Dockerfile 指令

| 指令          | 说明               | 示例                                            |
| ------------- | ------------------ | ----------------------------------------------- |
| `FROM`        | 指定基础镜像       | `FROM python:3.12-slim`                         |
| `RUN`         | 构建时执行命令     | `RUN apt-get update && apt-get install -y curl` |
| `COPY`        | 拷贝文件到镜像     | `COPY . /app`                                   |
| `ADD`         | 拷贝+解压/下载     | `ADD archive.tar.gz /app`                       |
| `WORKDIR`     | 设置工作目录       | `WORKDIR /app`                                  |
| `ENV`         | 设置运行时环境变量 | `ENV NODE_ENV=production`                       |
| `ARG`         | 设置构建时变量     | `ARG VERSION=latest`                            |
| `EXPOSE`      | 声明端口           | `EXPOSE 8080`                                   |
| `CMD`         | 容器启动默认命令   | `CMD ["python", "app.py"]`                      |
| `ENTRYPOINT`  | 容器入口点         | `ENTRYPOINT ["python"]`                         |
| `VOLUME`      | 声明数据卷         | `VOLUME ["/data"]`                              |
| `USER`        | 指定运行用户       | `USER appuser`                                  |
| `HEALTHCHECK` | 健康检查           | `HEALTHCHECK CMD curl -f http://localhost/`     |
| `LABEL`       | 添加元数据         | `LABEL version="1.0"`                           |

### 5.4 Docker Compose 命令

| 命令                                    | 说明                         |
| --------------------------------------- | ---------------------------- |
| `docker compose up -d`                  | 构建并启动所有服务（后台）   |
| `docker compose down`                   | 停止并删除容器和网络         |
| `docker compose down -v`                | 停止并删除容器、网络、数据卷 |
| `docker compose ps`                     | 查看服务状态                 |
| `docker compose logs -f <服务>`         | 跟踪服务日志                 |
| `docker compose exec <服务> bash`       | 进入服务容器                 |
| `docker compose build`                  | 重新构建镜像                 |
| `docker compose pull`                   | 拉取最新镜像                 |
| `docker compose config`                 | 验证配置文件语法             |
| `docker compose restart <服务>`         | 重启指定服务                 |
| `docker compose up -d --scale <服务>=N` | 扩缩容                       |

---

## 第六部分：故障排除

> 遇到问题时，先在这里查找解决方案。按错误现象分类整理。

### 问题 1：Cannot connect to the Docker daemon

**错误信息：**
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock.
Is the docker daemon running?
```

**原因与解决：**

```bash
# 原因 1：Docker 服务未启动
sudo systemctl start docker
sudo systemctl enable docker    # 设置开机自启

# 原因 2：当前用户不在 docker 组中
sudo usermod -aG docker $USER
newgrp docker
# 或者重新登录

# 原因 3：Docker 套接字权限错误
sudo chmod 666 /var/run/docker.sock
```

### 问题 2：镜像拉取超时或失败

**错误信息：**
```
Error response from daemon: Get "https://registry-1.docker.io/v2/": net/http: request canceled
```

**解决：**

```bash
# 方案 1：配置镜像加速源（参考 1.3.3 节）
sudo tee /etc/docker/daemon.json <<'EOF'
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://dockerproxy.net"
  ]
}
EOF
sudo systemctl restart docker

# 方案 2：使用 ECR Public 替代（参考 1.3.4 节）
docker pull public.ecr.aws/docker/library/nginx:latest

# 方案 3：手动指定完整镜像地址
docker pull docker.io/library/nginx:latest
```

### 问题 3：端口已被占用

**错误信息：**
```
Error: Bind for 0.0.0.0:8080 failed: port is already allocated
```

**解决：**

```bash
# 查看哪个进程占用了端口
sudo lsof -i :8080
# 或
sudo ss -tlnp | grep 8080

# 方案 1：停止占用端口的容器
docker ps | grep 8080
docker stop <占用端口的容器>

# 方案 2：更换映射端口
docker run -d -p 9090:80 nginx    # 改用 9090 端口

# 方案 3：杀掉占用端口的进程
sudo kill $(sudo lsof -t -i :8080)
```

### 问题 4：容器启动后立即退出

**排查步骤：**

```bash
# 第 1 步：查看退出码
docker ps -a
# 常见退出码：
# 0   - 正常退出（可能是前台命令执行完毕）
# 1   - 应用错误
# 137 - 被 OOM Killer 杀掉（内存不足）
# 139 - 段错误

# 第 2 步：查看容器日志
docker logs <容器名>

# 第 3 步：查看退出详细信息
docker inspect <容器名> | grep -A 5 "State"

# 常见原因：
# - Dockerfile 中 CMD 使用了后台运行模式（如 nginx 不加 -g "daemon off;"）
# - 应用启动时缺少必要的环境变量或配置文件
# - 端口冲突或数据卷挂载路径不存在
```

### 问题 5：磁盘空间不足

```bash
# 查看磁盘使用情况
df -h

# 查看 Docker 占用
docker system df

# 清理（参考 4.1 节的完整清理步骤）
docker system prune -a --volumes

# 检查 Docker 日志是否过大
sudo du -sh /var/lib/docker/containers/*/*-json.log

# 限制容器日志大小（在 compose.yaml 中配置）
# logging:
#   driver: json-file
#   options:
#     max-size: "10m"
#     max-file: "3"
```

### 问题 6：Dockerfile 构建缓存导致问题

```bash
# 完全不使用缓存构建
docker build --no-cache -t my-app:v1.0 .

# 清理构建缓存
docker builder prune

# 在 Dockerfile 中指定不缓存的点
# 在可能变化的步骤前添加：
# ARG CACHEBUST=1
# RUN apt-get update  # 这一步不会被缓存
```

---

## 总结与下一步

### 你已经学到了什么

| 部分           | 核心收获                                       |
| -------------- | ---------------------------------------------- |
| Docker 基础    | 镜像/容器/仓库三大概念，安装配置，日常管理命令 |
| Dockerfile     | 编写规范，多阶段构建，生产级最佳实践           |
| Docker Compose | 多服务编排，开发/生产环境配置                  |
| How-to 指南    | 磁盘清理、日志排查、项目容器化、数据共享与备份 |
| 命令速查表     | 日常高频操作的快速参考                         |

### 推荐的学习路径

```
✅ 你在这里
│
├──▶ [Nginx 入门到进阶](../02-nginx/README.md)
│    学习使用 Nginx 配合 Docker 部署 Web 服务
│
├──▶ [配置文件语法](../03-config-format/README.md)
│    掌握 Docker Compose 使用的 YAML 语法
│
└──▶ [Linux 常用运维命令](../04-linux-commands/README.md)
     深入学习容器调试中常用的 Linux 命令
```

### 进阶学习建议

1. **实践项目**：尝试将你自己的项目容器化，编写 Dockerfile 和 compose.yaml
2. **CI/CD 集成**：在 GitHub Actions 中使用 Docker 构建和推送镜像
3. **容器编排**：学习 Kubernetes 基础，理解从 Docker Compose 到 K8s 的演进
4. **安全加固**：研究容器镜像扫描（Trivy）、运行时安全（Falco）

---

## 参考链接

- [Docker 官方文档](https://docs.docker.com/)
- [Dockerfile 参考](https://docs.docker.com/engine/reference/builder/)
- [Docker Compose 文件参考](https://docs.docker.com/compose/compose-file/)
- [Docker Hub](https://hub.docker.com/)
- [Docker 速查表](https://wangchujiang.com/reference/docker.html)
