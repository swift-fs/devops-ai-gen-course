# Docker + Nginx 网关部署案例

本目录包含一组可实际运行的 Docker 部署案例，演示如何使用 **Nginx 反向代理网关** 统一管理多个前端和后端服务。

## 架构概览

```
                    ┌──────────────────┐
                    │   Nginx Gateway  │
                    │   端口 80:80     │
                    │  （独立部署）     │
                    └────────┬─────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
     ┌──────┴──────┐  ┌─────┴──────┐  ┌──────┴──────┐
     │  前端 SPA   │  │  前端 SPA  │  │  后端 API   │
     │ /vue/ 等路径 │  │ /react/ 等 │  │ /api/ /node/ │
     └─────────────┘  └────────────┘  └─────────────┘
```

所有服务通过 Docker **外部网络** `gateway-network` 互联，Nginx 网关作为统一入口，根据 URL 路径将请求转发到对应的后端容器。

**核心理念**：Nginx 网关是一个**独立部署、独立管理**的 Docker 服务，不与业务应用编排在一起。

## 两种二级目录部署方式

本案例提供两种 Nginx 网关转发方式，效果相同但配置不同：

| 对比项            |      去前缀转发（默认）      |      保留前缀转发（alias）       |
| ----------------- | :--------------------------: | :------------------------------: |
| 网关 `proxy_pass` | `http://app:80/`（有尾斜杠） |   `http://app:80`（无尾斜杠）    |
| 容器收到的路径    |    `/about`（前缀已去掉）    |  `/vue-alias/about`（前缀保留）  |
| 容器 Nginx        |    `root` + `location /`     | `alias` + `location /vue-alias/` |
| 容器独立访问      |         ❌ 路由不正常         |            ✅ 路由正常            |
| 适用场景          |         网关统一管理         |        前端容器需独立运行        |

> 两种方式的前端项目都需要配置 `base` 路径和路由 base，区别仅在于网关和容器内 Nginx 的配置。

## 案例列表

### 去前缀转发方式（默认）

| 案例           | 技术栈                      | 网关路径      | 说明                           |
| -------------- | --------------------------- | ------------- | ------------------------------ |
| Vue 单页应用   | Vue 3 + Vue Router + Vite   | `/vue/`       | 前端 SPA 二级目录部署          |
| React 单页应用 | React + React Router + Vite | `/react/`     | 前端 SPA 二级目录部署          |
| Go API 服务    | Go + GoFrame                | `/api/`       | 后端 RESTful API               |
| Vue 二级目录   | Vue 3 + Vue Router + Vite   | `/vue-sub/`   | SPA 二级目录部署（多路由页面） |
| React 二级目录 | React + React Router + Vite | `/react-sub/` | SPA 二级目录部署（多路由页面） |
| Node API 服务  | Node.js + Express           | `/node/`      | 后端 RESTful API               |

### 保留前缀转发方式（alias）

| 案例             | 技术栈                      | 网关路径        | 说明                                       |
| ---------------- | --------------------------- | --------------- | ------------------------------------------ |
| Vue alias 方式   | Vue 3 + Vue Router + Vite   | `/vue-alias/`   | SPA 二级目录部署（alias 映射，多路由页面） |
| React alias 方式 | React + React Router + Vite | `/react-alias/` | SPA 二级目录部署（alias 映射，多路由页面） |

## 目录结构

```
examples/
├── nginx-gateway/            # Nginx 反向代理网关 — 去前缀转发方式
│   ├── nginx.conf           # 反向代理与路由配置
│   ├── Dockerfile           # 网关镜像构建
│   └── docker-compose.yml   # 网关独立启动编排
├── nginx-gateway-alias/     # Nginx 反向代理网关 — 保留前缀转发方式（alias）
│   ├── nginx.conf
│   ├── Dockerfile
│   └── docker-compose.yml
├── vue-app/                 # Vue 单页应用 — /vue/ 路径
├── react-app/               # React 单页应用 — /react/ 路径
├── go-app/                  # Go (GoFrame) 后端 API — /api/ 路径
├── vue-subdir-app/          # Vue 单页应用 — /vue-sub/ 路径（多路由页面）
├── react-subdir-app/        # React 单页应用 — /react-sub/ 路径（多路由页面）
├── vue-subdir-app-alias/    # Vue 单页应用 — /vue-alias/ 路径（alias 方式）
├── react-subdir-app-alias/  # React 单页应用 — /react-alias/ 路径（alias 方式）
├── node-app/                # Node.js (Express) 后端 API — /node/ 路径
├── docker-compose.all.yml   # 一键启动全部服务 — 去前缀方式
└── docker-compose.alias.yml # 一键启动全部服务 — 保留前缀方式（alias）
```

## 前置条件

- [Docker](https://docs.docker.com/get-docker/) >= 20.10
- [Docker Compose](https://docs.docker.com/compose/install/) >= 2.0（V2 版本，使用 `docker compose` 命令）
- 至少 4GB 可用内存（所有服务同时运行）

## 快速开始

### 方式一：一键启动全部服务（演示用）

**去前缀转发方式**（默认）：

```bash
# 1. 进入案例目录
cd examples

# 2. 手动创建外部网络（必须先执行）
docker network create gateway-network

# 3. 一键构建并启动所有服务
docker compose -f docker-compose.all.yml up -d --build
```

**保留前缀转发方式**（alias）：

```bash
# 1. 进入案例目录
cd examples

# 2. 手动创建外部网络（如果已创建可跳过）
docker network create gateway-network

# 3. 一键构建并启动所有服务
docker compose -f docker-compose.alias.yml up -d --build
```

### 方式二：网关独立启动（推荐生产环境参考）

Nginx 网关是独立的服务，应单独启动和管理，不与业务项目编排在一起。

```bash
# 1. 创建外部网络
docker network create gateway-network

# 2. 先启动各业务服务（在各自目录下）
cd vue-app && docker compose up -d
cd ../react-app && docker compose up -d
cd ../go-app && docker compose up -d
# ... 其他服务同理

# 3. 最后启动网关
cd ../nginx-gateway && docker compose up -d
```

> 网关通过 `depends_on` 确保后端服务就绪后再启动。如果网关先启动，Nginx 会返回 502 直到后端服务可用。

### 验证服务状态

```bash
# 查看所有容器运行状态
docker ps --format "table {{.Names}}\t{{.Status}}"

# 查看 Nginx 网关日志
docker logs nginx-gateway
```

### 访问服务

**去前缀转发方式**（`docker-compose.all.yml`）：

| 服务                  | 地址                             | 预期返回                      |
| --------------------- | -------------------------------- | ----------------------------- |
| Vue SPA               | http://localhost/vue/            | Vue 页面                      |
| Vue SPA 关于页        | http://localhost/vue/about       | Vue 页面（SPA 路由）          |
| React SPA             | http://localhost/react/          | React 页面                    |
| React SPA 关于页      | http://localhost/react/about     | React 页面（SPA 路由）        |
| Go API                | http://localhost/api/hello       | `{"message":"Hello, World!"}` |
| Vue 二级目录          | http://localhost/vue-sub/        | Vue 页面                      |
| Vue 二级目录 关于页   | http://localhost/vue-sub/about   | Vue 页面（SPA 路由）          |
| React 二级目录        | http://localhost/react-sub/      | React 页面                    |
| React 二级目录 关于页 | http://localhost/react-sub/about | React 页面（SPA 路由）        |
| Node API              | http://localhost/node/hello      | `{"message":"Hello, World!"}` |
| 健康检查              | http://localhost/health          | `ok`                          |

**保留前缀转发方式**（`docker-compose.alias.yml`）：

| 服务               | 地址                               | 预期返回               |
| ------------------ | ---------------------------------- | ---------------------- |
| Vue alias 方式     | http://localhost/vue-alias/        | Vue 页面               |
| Vue alias 关于页   | http://localhost/vue-alias/about   | Vue 页面（SPA 路由）   |
| React alias 方式   | http://localhost/react-alias/      | React 页面             |
| React alias 关于页 | http://localhost/react-alias/about | React 页面（SPA 路由） |
| 健康检查           | http://localhost/health            | `ok`                   |

### 停止服务

```bash
# 停止去前缀方式的全部服务
docker compose -f docker-compose.all.yml down

# 停止保留前缀方式的全部服务
docker compose -f docker-compose.alias.yml down

# 停止网关（独立模式）
cd nginx-gateway && docker compose down

# 清除构建镜像
docker compose -f docker-compose.all.yml down --rmi local
```

## Docker 网络说明

`gateway-network` 是一个 **Docker 外部网络**，必须手动创建：

```bash
docker network create gateway-network
```

> **重要**：`docker-compose.all.yml` 中定义了 `networks.gateway-network.external: true`，这表示该网络**不会自动创建**。如果忘记手动创建，启动时会报错 `network gateway-network declared as external, but could not be found`。

所有服务通过这个外部网络互联，Nginx 网关通过 Docker 容器名（如 `vue-app`、`go-app`）访问后端服务：

**去前缀方式网络拓扑**：

```
┌──────────────────────────────────────────────────┐
│       Docker 外部网络: gateway-network            │
│                                                  │
│  nginx-gateway ──→ vue-app          (:80)        │
│                 ──→ react-app        (:80)        │
│                 ──→ go-app           (:8000)      │
│                 ──→ vue-subdir-app   (:80)        │
│                 ──→ react-subdir-app (:80)        │
│                 ──→ node-app         (:3000)      │
└──────────────────────────────────────────────────┘
```

**保留前缀方式网络拓扑**：

```
┌──────────────────────────────────────────────────┐
│       Docker 外部网络: gateway-network            │
│                                                  │
│  nginx-gateway-alias ──→ vue-subdir-app-alias     │
│                      ──→ react-subdir-app-alias   │
└──────────────────────────────────────────────────┘
```

## 各案例详解

### 1. Nginx 网关（独立服务）

> 目录：`nginx-gateway/`

Nginx 网关是一个**独立部署的 Docker 服务**，不与业务应用编排在一起。它负责：
- 根据请求路径将流量分发到不同的后端容器
- 统一设置代理请求头（`X-Real-IP`、`X-Forwarded-For` 等）
- 提供全局健康检查端点 `/health`

关键配置片段（`nginx.conf`）：

```nginx
# 前端 SPA：proxy_pass 末尾带 / 会去掉 location 前缀后转发
# 浏览器请求 /vue/assets/xxx.js → 网关去掉 /vue/ → 容器收到 /assets/xxx.js
location /vue/ {
    proxy_pass http://vue-app:80/;
}

# 后端 API：同样去掉前缀
location /api/ {
    proxy_pass http://go-app:8000/;
}
```

网关可以独立启动：

```bash
cd nginx-gateway
docker compose up -d
```

> 注意：独立启动网关前，需要确保后端服务已在 `gateway-network` 网络中运行，否则 Nginx 会报 502 错误。

### 2. Vue 单页应用 — `/vue/` 路径部署

> 目录：`vue-app/`

演示前端 SPA 部署在网关 `/vue/` 路径的场景。使用多阶段构建：

- **阶段一**：`node:20-alpine` 执行 `npm run build`，生成静态产物到 `/app/dist`
- **阶段二**：`nginx:1.27-alpine` 提供静态文件服务，配置 SPA history 路由回退

二级目录部署需要三层配置联动：

**① Vite `base` 配置**（`vite.config.js`）：
```js
// base 决定 HTML 中 JS/CSS 引用路径的前缀
// 设为 '/vue/' 后，HTML 里引用变为 <script src="/vue/assets/index-xxx.js">
export default defineConfig({
  base: '/vue/',
})
```

**② 前端路由 base 配置**（`src/main.js`）：
```js
// Router base 决定前端路由跳转的 URL 前缀
// 设为 '/vue/' 后，<router-link to="/about"> 跳转到 /vue/about
const router = createRouter({
  history: createWebHistory('/vue/'),
})
```

**③ 容器内 Nginx 配置**（`nginx.conf`）：
```nginx
# 网关 proxy_pass 末尾带 /，会去掉 /vue/ 前缀后转发
# 容器收到的都是根路径请求，所以 location / 即可
location / {
    try_files $uri $uri/ /index.html;
}
```

**请求流转过程**：

```
浏览器请求: http://localhost/vue/about
    ↓
Nginx 网关 location /vue/ → proxy_pass http://vue-app:80/
    ↓ (去掉 /vue/ 前缀，变为 /about)
Vue 容器收到: GET /about
    ↓
容器 nginx try_files → 找不到文件 → 回退 /index.html
    ↓
Vue Router 解析 URL /vue/about（浏览器 URL 未变）→ 匹配 /about 路由 ✅
```

### 3. React 单页应用 — `/react/` 路径部署

> 目录：`react-app/`

与 Vue 案例相同的二级目录部署模式，关键配置：

**① Vite `base` 配置**（`vite.config.js`）：
```js
export default defineConfig({
  base: '/react/',
})
```

**② React Router `basename` 配置**（`src/main.jsx`）：
```jsx
// basename 决定前端路由跳转的 URL 前缀
<BrowserRouter basename="/react">
```

**③ 容器内 Nginx**：与 Vue 案例相同，`location /` + `try_files` 回退。

### 4. Go API 服务（GoFrame）— `/api/` 路径

> 目录：`go-app/`

基于 GoFrame 框架的 RESTful API 服务，演示后端 API 的容器化部署：

- **阶段一**：`golang:1.23-alpine` 编译 Go 二进制文件
- **阶段二**：`alpine:3.20` 仅拷贝编译产物运行

安全实践：
- 使用非特权用户 `appuser` 运行
- 编译参数 `-ldflags="-s -w"` 去除调试信息，减小二进制体积
- 最终镜像仅包含静态编译的二进制文件，无 Go 工具链

### 5. Vue 二级目录部署 — `/vue-sub/` 路径

> 目录：`vue-subdir-app/`

演示 Vue SPA 部署在非根路径 `/vue-sub/` 的场景，包含多个路由页面（首页 + 关于页）。
与 vue-app 的配置模式完全一致，只是路径前缀不同：

- `vite.config.js`：`base: '/vue-sub/'`
- Vue Router：`createWebHistory('/vue-sub/')`
- 网关 nginx：`location /vue-sub/` → `proxy_pass http://vue-subdir-app:80/;`

### 6. React 二级目录部署 — `/react-sub/` 路径

> 目录：`react-subdir-app/`

与 Vue 二级目录类似，React 版本的子路径部署，包含多个路由页面。
关键配置：
- `vite.config.js`：`base: '/react-sub/'`
- React Router：`<BrowserRouter basename="/react-sub">`
- 网关 nginx：`location /react-sub/` → `proxy_pass http://react-subdir-app:80/;`

### 7. Node.js API 服务（Express）— `/node/` 路径

> 目录：`node-app/`

基于 Express 框架的轻量 API 服务。安全实践：
- 使用 `--omit=dev` 仅安装生产依赖
- 使用非特权用户 `nodeuser` 运行

---

### 保留前缀转发方式（alias）详解

以下案例演示 **网关保留路径前缀转发 + 容器 Nginx 使用 `alias` 映射** 的部署方式。

#### 8. Nginx 网关（alias 方式）

> 目录：`nginx-gateway-alias/`

与默认网关的核心区别在于 `proxy_pass` **不带尾斜杠**：

```nginx
# 默认方式（去前缀）：proxy_pass 末尾有 /，去掉 /vue/ 前缀后转发
location /vue/ {
    proxy_pass http://vue-app:80/;     # ← 有尾斜杠
}

# alias 方式（保留前缀）：proxy_pass 末尾无 /，原样转发路径
location /vue-alias/ {
    proxy_pass http://vue-subdir-app-alias:80;   # ← 无尾斜杠
}
```

#### 9. Vue alias 方式 — `/vue-alias/` 路径

> 目录：`vue-subdir-app-alias/`

前端项目配置与去前缀方式相同，**区别在于容器内 Nginx 使用 `alias` 代替 `root`**：

**① Vite `base` 配置**（`vite.config.js`）：
```js
export default defineConfig({
  base: '/vue-alias/',
})
```

**② Vue Router base 配置**（`src/main.js`）：
```js
const router = createRouter({
  history: createWebHistory('/vue-alias/'),
})
```

**③ 容器内 Nginx 配置**（`nginx.conf`）— **关键区别**：
```nginx
# alias 方式：location 匹配带前缀的路径，alias 将前缀替换为文件目录
# /vue-alias/index.html → /usr/share/nginx/html/index.html ✅
location /vue-alias/ {
    alias /usr/share/nginx/html/;
    try_files $uri $uri/ /vue-alias/index.html;
}

# 对比去前缀方式（root）：location 匹配根路径，root 直接指向文件目录
# /index.html → /usr/share/nginx/html/index.html ✅
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
}
```

> **`root` vs `alias` 的区别**：
> - `root`：将 location 路径**拼接**到 root 后面 → `/usr/share/nginx/html` + `/vue-alias/index.html`
> - `alias`：将 location 路径**替换**为 alias 指定的目录 → `/usr/share/nginx/html/` 替换 `/vue-alias/`

**请求流转过程**：

```
浏览器请求: http://localhost/vue-alias/about
    ↓
Nginx 网关 location /vue-alias/ → proxy_pass http://vue-subdir-app-alias:80
    ↓ (保留 /vue-alias/ 前缀，原样转发)
Vue 容器收到: GET /vue-alias/about
    ↓
容器 nginx location /vue-alias/ → alias 替换为 /usr/share/nginx/html/
    ↓ try_files 找不到文件 → 回退 /vue-alias/index.html
Vue Router 解析 URL /vue-alias/about → 去掉 base 前缀 → 匹配 /about 路由 ✅
```

#### 10. React alias 方式 — `/react-alias/` 路径

> 目录：`react-subdir-app-alias/`

与 Vue alias 方式相同，React 版本的关键配置：

- `vite.config.js`：`base: '/react-alias/'`
- React Router：`<BrowserRouter basename="/react-alias">`
- 容器 Nginx：`location /react-alias/ { alias /usr/share/nginx/html/; }`

---

## 自定义扩展

### 添加新服务

1. 创建新项目目录，编写 `Dockerfile` 和 `docker-compose.yml`，加入 `gateway-network`
2. 在 `nginx-gateway/nginx.conf` 中添加 `location` 块
3. 重建网关使其生效

### 修改路由规则

编辑 `nginx-gateway/nginx.conf`，添加或修改 `location` 块后重建网关：

```bash
# 独立模式
cd nginx-gateway && docker compose up -d --build

# 一键模式
docker compose -f docker-compose.all.yml up -d --build nginx-gateway
```

## 常见问题

### 容器显示 unhealthy

健康检查使用 `wget` 访问 `127.0.0.1`，确保容器内服务正常监听。排查步骤：

```bash
# 查看容器日志
docker logs <容器名>

# 进入容器检查
docker exec -it <容器名> sh
wget --no-verbose --tries=1 --spider http://127.0.0.1:<端口>/health
```

### Nginx 网关报 502 Bad Gateway

后端服务未就绪或不在同一网络。检查：

```bash
# 确认所有容器在同一网络
docker network inspect gateway-network

# 重启网关
cd nginx-gateway && docker compose restart
```

### 前端页面白屏 / JS 404

通常是 Vite `base` 配置与网关路径不一致导致。确保：

**去前缀方式**：

1. `vite.config.js` 的 `base` 与网关 `location` 路径一致（如 `/vue/`）
2. 网关 `proxy_pass` 末尾带 `/`（去掉前缀转发）
3. 容器内 nginx 使用 `location /` + `try_files $uri $uri/ /index.html`

**保留前缀方式（alias）**：

1. `vite.config.js` 的 `base` 与网关 `location` 路径一致（如 `/vue-alias/`）
2. 网关 `proxy_pass` 末尾**不带** `/`（保留前缀转发）
3. 容器内 nginx 使用 `location /vue-alias/` + `alias` + `try_files $uri $uri/ /vue-alias/index.html`
4. `alias` 末尾必须带 `/`，否则路径映射会出错

### 端口冲突

网关默认占用宿主机 80 端口。如需修改，编辑 `nginx-gateway/docker-compose.yml` 中的 `ports` 配置：

```yaml
ports:
  - "8080:80"   # 将宿主机端口改为 8080
```

## 清理

```bash
# 停止去前缀方式的全部服务
docker compose -f docker-compose.all.yml down

# 停止保留前缀方式的全部服务
docker compose -f docker-compose.alias.yml down

# 停止 + 清除镜像
docker compose -f docker-compose.all.yml down --rmi local

# 删除外部网络（确保所有服务已停止）
docker network rm gateway-network
```
