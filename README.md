# DevOps 运维课程 — 使用指南

> 从零基础到进阶的运维课程，涵盖 Docker、Nginx、配置文件语法、Linux 命令、Debian 包管理等核心技术。

---

## 📦 克隆项目

```bash
git clone <your-repo-url> devops-ai-gen-course
cd devops-ai-gen-course
```

## 🚀 启动本地预览

课程内容为 Markdown 格式，通过一个美观的 Web 页面浏览。你需要启动一个本地 HTTP 服务器。

> ⚠️ 不能直接双击 `index.html` 打开（浏览器会因安全策略阻止加载 Markdown 文件），必须通过 HTTP 服务器访问。

以下提供 **5 种启动方式**，选择你已有环境的即可：

---

### 方式一：Python（推荐 ✅）

大多数系统自带 Python，无需额外安装。

```bash
# 进入项目目录
cd devops-ai-gen-course

# Python 3（大部分情况）
python -m http.server 8000

# 如果上面的命令报错，试试 python3
python3 -m http.server 8000

# 如果想指定其他端口
python -m http.server 3000
```

启动后浏览器访问：**http://localhost:8000**

按 `Ctrl + C` 停止服务器。

---

### 方式二：Node.js

如果你安装了 Node.js（前端开发者通常已有）：

```bash
# 方式 2a：使用 serve（推荐）
npx serve .

# 方式 2b：使用 http-server
npx http-server -p 8000

# 方式 2c：使用 live-server（支持热重载）
npx live-server --port=8000
```

启动后浏览器访问：**http://localhost:8000**（或终端提示的地址）

按 `Ctrl + C` 停止服务器。

---

### 方式三：VS Code Live Server 插件

如果你使用 VS Code 编辑器：

1. 安装 **Live Server** 插件（扩展商店搜索 "Live Server"）
2. 在 VS Code 中打开项目文件夹
3. 右键点击 `index.html` → 选择 **Open with Live Server**
4. 浏览器会自动打开

关闭 VS Code 或点击状态栏的 "Port: 5500" 停止服务器。

---

### 方式四：PHP

如果你的环境安装了 PHP：

```bash
cd devops-ai-gen-course
php -S localhost:8000
```

启动后浏览器访问：**http://localhost:8000**

按 `Ctrl + C` 停止服务器。

---

### 方式五：Docker（云原生方式 🐳）

如果你安装了 Docker，甚至不需要安装任何语言环境：

```bash
# 使用 Nginx 镜像一键启动
docker run -d \
  --name devops-course \
  -p 8000:80 \
  -v $(pwd):/usr/share/nginx/html:ro \
  nginx:alpine

# Windows PowerShell 用户用这个：
docker run -d --name devops-course -p 8000:80 -v ${PWD}:/usr/share/nginx/html:ro nginx:alpine
```

启动后浏览器访问：**http://localhost:8000**

```bash
# 停止并删除容器
docker stop devops-course && docker rm devops-course
```

---

## 📁 项目结构

```
devops-ai-gen-course/
├── README.md                        # 本文件（使用指南）
├── index.html                       # 课程导航页面
└── stage-1/                         # 第一阶段：基础入门
    ├── 01-docker/README.md          # Docker 从入门到进阶
    ├── 02-nginx/README.md           # Nginx 从入门到进阶
    ├── 03-config-format/README.md   # TOML / YAML / INI 语法教程
    ├── 04-linux-commands/README.md  # Linux 常用运维命令
    └── 05-debian-pkg/README.md      # Debian 包管理器教程
```

## 📚 课程内容

> 每个课程模块都按照 **Diátaxis 文档框架** 组织，包含四个层次：
> - **Tutorial（教程）** — 循序渐进的学习路径
> - **How-to Guide（操作指南）** — 常见问题的解决方案
> - **Reference（参考手册）** — 命令和配置速查表
> - **Troubleshooting（故障排除）** — 常见错误及解决方法

| 序号 | 课程 | 主要内容 | 文档层次 |
|:----:|------|---------|---------|
| 01 | **Docker 入门到进阶** | Docker Engine、Dockerfile（多阶段构建）、Docker Compose 多服务编排 | Tutorial + How-to + Reference |
| 02 | **Nginx 入门到进阶** | 静态服务、反向代理、负载均衡、SSL/HTTPS、Docker 部署 | Tutorial + How-to + Reference |
| 03 | **TOML/YAML/INI 语法** | 三种配置文件格式的完整语法、对比与实战 | Tutorial + How-to + Reference |
| 04 | **Linux 常用运维命令** | curl、chmod、ssh、tar/zip、systemd 服务管理 | Tutorial + How-to + Reference |
| 05 | **Debian 包管理器** | apt、dpkg 使用、软件源配置、镜像加速 | Tutorial + How-to + Reference |

## ❓ 常见问题

**Q: 页面显示"加载失败"？**

A: 确保通过 HTTP 服务器访问（地址是 `http://localhost:...`），而不是直接双击 `index.html` 打开（地址是 `file:///...`）。

**Q: 端口被占用怎么办？**

A: 换一个端口号，比如 `python -m http.server 3000` 或 `python -m http.server 9000`。

**Q: 我想直接阅读 Markdown 源文件？**

A: 当然可以！`stage-1/` 目录下的每个 `README.md` 都是完整的教程，可以用任何 Markdown 编辑器（如 Typora、VS Code）直接打开阅读。

**Q: 如何在手机/平板上查看？**

A: 确保手机和电脑在同一局域网内，用电脑的局域网 IP 替换 `localhost`。例如：`http://192.168.1.100:8000`。可通过 `ipconfig`（Windows）或 `ifconfig`（Mac/Linux）查看本机 IP。
