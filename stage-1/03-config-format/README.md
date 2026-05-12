# TOML / YAML / INI 配置文件语法教程

> 最后更新：2026-05

---

## 学习目标

完成本教程后，你将能够：

- ✅ 区分 TOML、YAML、INI 三种配置文件格式的特点和适用场景
- ✅ 熟练编写 YAML 文件（Docker Compose、GitHub Actions 的基础）
- ✅ 理解 TOML 的表和数组结构（现代项目配置的新标准）
- ✅ 快速阅读和修改 INI 格式配置（PHP、MySQL、Git 等）
- ✅ 避免三种格式中常见的语法陷阱

## 前置条件

| 条件 | 说明 | 必要性 |
|------|------|--------|
| 基本文本编辑 | 能使用编辑器编辑纯文本文件 | 必需 |
| JSON 概念 | 了解键值对、数组、嵌套等基本数据结构 | 推荐 |
| Docker 基础 | 理解 Docker Compose 需要阅读 YAML 配置 | 有帮助 |

> 💡 **本教程是后续课程的基础**：[Docker](../01-docker/README.md) 和 [Nginx](../02-nginx/README.md) 教程中大量使用 YAML 配置文件。

---

## 目录

- [概述与对比](#概述与对比)
- [第一部分：TOML 语法](#第一部分toml-语法)
- [第二部分：YAML 语法](#第二部分yaml-语法)
- [第三部分：INI 语法](#第三部分ini-语法)
- [实战对比：同一配置的三种写法](#实战对比同一配置的三种写法)
- [第四部分：常见操作指南（How-to）](#第四部分常见操作指南how-to)
- [第五部分：语法速查表（Reference）](#第五部分语法速查表reference)
- [总结与下一步](#总结与下一步)
- [参考链接](#参考链接)

---

## 概述与对比

TOML、YAML、INI 是运维和开发中最常见的三种配置文件格式。

| 特性 | TOML | YAML | INI |
|------|------|------|-----|
| 全称 | Tom's Obvious Minimal Language | YAML Ain't Markup Language | Initialization File |
| 复杂度 | 中等 | 较高 | 简单 |
| 可读性 | ★★★★★ | ★★★★☆ | ★★★★★ |
| 层级表示 | 使用表（表头） | 使用缩进 | 使用节（section） |
| 数据类型 | 丰富（字符串、数字、数组、日期等） | 丰富 | 简单（基本只有字符串） |
| 适用场景 | Rust/Go 项目配置、Docker Compose (可替换) | Docker Compose、K8s、CI/CD | 简单配置、Git 配置、Windows 应用 |
| 注释符号 | `#` | `#` | `#` 或 `;` |
| 常见文件 | `Cargo.toml`、`pyproject.toml` | `compose.yaml`、`.github/workflows/*.yml` | `php.ini`、`my.cnf`、`.gitconfig` |

**如何选择：**
- **简单配置**（key=value）：用 **INI**
- **需要复杂数据结构**（数组、嵌套）：用 **YAML** 或 **TOML**
- **云原生/容器化**场景：用 **YAML**（Docker Compose、Kubernetes）
- **现代语言项目**配置：用 **TOML**（Rust、Python 新标准）

---

## 第一部分：TOML 语法

TOML（Tom's Obvious Minimal Language）是一种专为配置文件设计的格式，目标是做到语义明确、易于解析。

### 1.1 基本语法

```toml
# 这是一个 TOML 文件
# 注释以 # 开头

# 键值对（最基本的元素）
# 格式：键 = 值
title = "TOML 示例配置"
version = "1.0.0"

# 键名可以包含字母、数字、下划线和短横线
server-name = "production"    # 短横线
server_port = 8080            # 下划线

# 等号两侧的空格会被忽略
name = "Alice"                # 推荐写法
name="Alice"                  # 也可以，但不推荐
```

### 1.2 数据类型

```toml
# ===== 字符串 =====
# 基本字符串（支持转义字符）
title = "Hello \"World\""     # 使用 \" 转义双引号
path = "C:\\Users\\Alice"     # 使用 \\ 转义反斜杠

# 多行字符串（三个双引号）
description = """
这是一个
多行字符串，
换行符会被保留。
"""

# 字面量字符串（不处理转义）
regex = '\d+\.\d+'            # 单引号，\d 不会被转义
windows_path = 'C:\Users\Alice'  # 反斜杠不需要转义

# 多行字面量字符串
poem = '''
静夜思
床前明月光
疑是地上霜
'''

# ===== 整数 =====
port = 8080
negative = -42
hex = 0xDEADBEEF              # 十六进制
octal = 0o755                 # 八进制
binary = 0b11010110           # 二进制
large_number = 1_000_000      # 下划线分隔符，提高可读性

# ===== 浮点数 =====
pi = 3.14159
exp = 1e10                    # 科学计数法
positive = +1.0
negative_float = -0.01

# ===== 布尔值 =====
debug = true                  # 小写，不能写成 True 或 TRUE
production = false

# ===== 日期时间 =====
date = 2024-01-15                                    # 本地日期
time = 12:30:45                                      # 本地时间
datetime = 2024-01-15T12:30:45                        # 本地日期时间
datetime_utc = 2024-01-15T12:30:45Z                   # UTC 时间
datetime_offset = 2024-01-15T12:30:45+08:00           # 带时区偏移
```

### 1.3 表（Table）—— 相当于对象/字典

```toml
# 表的定义：[表名]
# 表内的键值对属于该表

[database]
host = "localhost"
port = 5432
name = "myapp"
user = "admin"

# 上面等价于 JSON：
# { "database": { "host": "localhost", "port": 5432, ... } }

# 表的嵌套：使用点号表示层级关系
[server]
name = "web-server"

[server.logging]
level = "info"
path = "/var/log/app.log"

[server.logging.rotation]
max_size = "100MB"
max_files = 10

# 等价于 JSON：
# { "server": { "name": "web-server", "logging": { "level": "info", "rotation": { ... } } } }
```

### 1.4 内联表（Inline Table）

```toml
# 内联表：一行写完，适合简单的嵌套
point = { x = 1, y = 2 }
server = { host = "localhost", port = 8080 }

# 等价于：
# [point]
# x = 1
# y = 2
```

### 1.5 数组（Array）

```toml
# 基本数组
ports = [80, 443, 8080]
hosts = ["alpha", "beta", "gamma"]

# 混合类型数组（不推荐，但语法允许）
mixed = [1, "two", true]

# 多行数组（末尾逗号可选）
packages = [
    "nginx",
    "postgresql",
    "redis",
    "nodejs",
]

# 嵌套数组
matrix = [[1, 2], [3, 4]]
```

### 1.6 表数组（Array of Tables）

```toml
# 表数组：使用 [[双中括号]]
# 每个 [[products]] 定义数组中的一个元素

[[products]]
name = "Hammer"
price = 19.99

[[products]]
name = "Nail"
price = 0.99

[[products]]
name = "Screwdriver"
price = 12.50

# 等价于 JSON：
# { "products": [
#     { "name": "Hammer", "price": 19.99 },
#     { "name": "Nail", "price": 0.99 },
#     { "name": "Screwdriver", "price": 12.50 }
# ] }

# 表数组可以包含嵌套表
[[servers]]
name = "alpha"
ip = "10.0.0.1"

[servers.metadata]
region = "us-east"
env = "production"

[[servers]]
name = "beta"
ip = "10.0.0.2"

[servers.metadata]
region = "eu-west"
env = "staging"
```

### 1.7 完整实战示例

```toml
# pyproject.toml —— Python 项目配置文件（真实案例）

[project]
name = "my-webapp"
version = "1.0.0"
description = "一个现代化的 Web 应用"
readme = "README.md"
requires-python = ">=3.12"
license = { text = "MIT" }
authors = [
    { name = "Alice", email = "alice@example.com" },
]

dependencies = [
    "flask>=3.0",
    "gunicorn>=21.0",
    "sqlalchemy>=2.0",
    "redis>=5.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0",
    "black>=24.0",
    "ruff>=0.4",
]

[project.scripts]
myapp = "my_webapp.cli:main"

[tool.black]
line-length = 88

[tool.ruff]
line-length = 88
select = ["E", "F", "W", "I"]

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
```

---

## 第二部分：YAML 语法

YAML（YAML Ain't Markup Language）是云原生领域使用最广泛的配置格式，Docker Compose、Kubernetes、GitHub Actions 等都使用 YAML。

### 2.1 基本语法

```yaml
# YAML 注释以 # 开头

# 键值对
# 格式：键: 值（注意冒号后面必须有空格）
title: YAML 示例配置
version: "1.0.0"

# ⚠️ YAML 对缩进非常敏感！
# 使用空格缩进（不能使用 Tab），通常 2 个空格为一级
# 同一层级的元素必须有相同的缩进

# 正确 ✅
server:
  host: localhost
  port: 8080

# 错误 ❌（缩进不一致）
# server:
#   host: localhost
#    port: 8080       # 多了一个空格
```

### 2.2 数据类型

```yaml
# ===== 字符串 =====
# 通常不需要引号
name: Alice

# 包含特殊字符时需要引号
title: "Hello: World"           # 包含冒号需要引号
formula: "value = 1 + 2"        # 包含等号
path: "C:\\Users\\Alice"        # 双引号中使用 \\ 转义
regex: '\d+\.\d+'               # 单引号中不处理转义

# 多行字符串
# | 保留换行符（块标量）
description: |
  这是第一行
  这是第二行
  这是第三行
# 结果："这是第一行\n这是第二行\n这是第三行\n"

# > 折叠换行（换行变为空格）
summary: >
  这是一段很长的文本，
  YAML 会把换行折叠成空格，
  最终变成一行。
# 结果："这是一段很长的文本， YAML 会把换行折叠成空格， 最终变成一行。\n"

# ===== 数字 =====
port: 8080                      # 整数
pi: 3.14159                     # 浮点数
large: 1_000_000                # 下划线分隔符
hex: 0x1A                       # 十六进制
octal: 0o755                    # 八进制

# ===== 布尔值 =====
debug: true                     # 小写 true/false
production: false

# ⚠️ 注意以下值也会被解析为布尔值！
# yes, on, no, off（不同解析器行为不同）
# 建议使用引号包裹避免歧义
answer: "yes"                   # 字符串 "yes"
flag: "on"                      # 字符串 "on"

# ===== 空值 =====
placeholder: null               # null
empty: ~                        # ~ 也是 null
no_value:                       # 没有值也是 null

# ===== 日期时间 =====
date: 2024-01-15                # 日期
datetime: 2024-01-15T12:30:45Z  # UTC 时间
local_datetime: 2024-01-15T12:30:45+08:00  # 带时区
```

### 2.3 对象（Mapping）

```yaml
# 基本对象
server:
  host: localhost
  port: 8080
  workers: 4

# 嵌套对象
app:
  name: myapp
  version: 1.0
  database:
    host: db.example.com
    port: 5432
    name: appdb
    credentials:
      username: admin
      password: secret

# 行内对象（类似 JSON）
point: { x: 1, y: 2 }
config: { debug: true, port: 8080 }
```

### 2.4 数组（Sequence/List）

```yaml
# 基本数组（使用 - 前缀）
ports:
  - 80
  - 443
  - 8080

# 行内数组
colors: [red, green, blue]

# 对象数组
servers:
  - name: alpha
    ip: 10.0.0.1
    role: primary
  - name: beta
    ip: 10.0.0.2
    role: secondary
  - name: gamma
    ip: 10.0.0.3
    role: backup

# 数组嵌套
matrix:
  - [1, 2, 3]
  - [4, 5, 6]
  - [7, 8, 9]

# 复杂嵌套示例（Kubernetes 风格）
containers:
  - name: web
    image: nginx:1.27
    ports:
      - containerPort: 80
    resources:
      limits:
        memory: "512Mi"
        cpu: "500m"
```

### 2.5 特殊语法

```yaml
# ===== 锚点与别名（Anchor & Alias）—— 复用内容 =====
# & 定义锚点，* 引用锚点

default_config: &default        # 定义锚点
  timeout: 30
  retry: 3
  verbose: false

development:
  <<: *default                  # 合并锚点内容
  verbose: true                 # 覆盖特定值

production:
  <<: *default
  timeout: 60
  retry: 5

# 等价于：
# development:
#   timeout: 30
#   retry: 3
#   verbose: true
# production:
#   timeout: 60
#   retry: 5
#   verbose: false

# ===== 多文档（---分隔）=====
# 一个文件中包含多个 YAML 文档
---
apiVersion: v1
kind: Service
metadata:
  name: nginx
---
apiVersion: v1
kind: Deployment
metadata:
  name: nginx

# ===== 类型标签 =====
# 强制指定数据类型
explicit_str: !!str 123         # 强制为字符串
explicit_int: !!int "42"        # 强制为整数
explicit_float: !!float "3.14"  # 强制为浮点数
```

### 2.6 完整实战示例

```yaml
# .github/workflows/deploy.yml —— GitHub Actions CI/CD 配置
name: Deploy Application

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11", "3.12"]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest

      - name: Run tests
        run: pytest tests/ -v

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
```

### 2.7 YAML 常见陷阱

```yaml
# ⚠️ 陷阱 1：冒号后面必须有空格
host: localhost    # ✅ 正确
host:localhost     # ❌ 错误

# ⚠️ 陷阱 2：字符串可能被意外解析为其他类型
version: 1.0       # 浮点数 1.0，不是字符串 "1.0"
version: "1.0"     # 字符串 "1.0" ✅

city: Oslo         # 字符串 ✅
city: [Oslo]       # 变成了数组！
city: "Oslo"       # 字符串 ✅（最安全）

# ⚠️ 陷阱 3：布尔值歧义
answer: yes        # 可能被解析为 true！
answer: "yes"      # 字符串 "yes" ✅

# ⚠️ 陷阱 4：缩进错误
# 使用 Tab 会导致解析错误！
# 大多数编辑器可以设置 "将 Tab 转为空格"

# ⚠️ 陷阱 5：空格敏感性
- item1            # ✅ - 后面有空格
-item2             # ❌ - 后面没有空格
```

---

## 第三部分：INI 语法

INI 格式是最简单的配置文件格式，广泛用于各类应用的简单配置。

### 3.1 基本语法

```ini
# INI 注释以 # 或 ; 开头

# 键值对
# 格式：键 = 值 或 键: 值
name = Alice
age = 30

# 分号也可以做注释
; 这也是注释

# 值前后的空格通常被忽略
host = localhost    # 等价于 host=localhost
```

### 3.2 节（Section）

```ini
# 节用 [方括号] 定义
# 节内的键值对属于该节

[server]
host = 0.0.0.0
port = 8080
workers = 4

[database]
host = localhost
port = 5432
name = myapp
user = admin
password = secret

[logging]
level = info
file = /var/log/app.log
max_size = 100MB

# 上面等价于：
# server.host = 0.0.0.0
# server.port = 8080
# database.host = localhost
# ...
```

### 3.3 数据类型与特殊语法

```ini
# ⚠️ INI 的值都是字符串！
# "true" 是字符串 "true"，不是布尔值
# "42" 是字符串 "42"，不是数字
# 解析时需要程序自己转换类型

[app]
debug = true                    # 字符串 "true"
port = 8080                     # 字符串 "8080"
rate = 3.14                     # 字符串 "3.14"

# 多行值（部分解析器支持）
description = 这是一个 \
    多行的 \
    描述信息

# 值中包含特殊字符时可以用引号（部分解析器支持）
path = "C:\Users\Alice\AppData"
greeting = "Hello, World!"

# 没有值（部分解析器支持）
feature_enabled                 # 没有等号，表示 true/启用
```

### 3.4 常见 INI 配置文件示例

#### PHP 配置文件 `php.ini`

```ini
[PHP]
; 语言选项
engine = On
short_open_tag = Off
precision = 14
output_buffering = 4096
max_execution_time = 30
max_input_time = 60
memory_limit = 256M
error_reporting = E_ALL
display_errors = Off
log_errors = On
error_log = /var/log/php/error.log

; 文件上传
file_uploads = On
upload_max_filesize = 50M
max_file_uploads = 20
post_max_size = 50M

[Date]
date.timezone = Asia/Shanghai

[Session]
session.save_handler = files
session.save_path = "/var/lib/php/sessions"
session.cookie_httponly = On
session.cookie_secure = On
session.use_strict_mode = On

[opcache]
opcache.enable = 1
opcache.memory_consumption = 256
opcache.max_accelerated_files = 4000
opcache.validate_timestamps = 0
```

#### MySQL 配置文件 `my.cnf`

```ini
[mysqld]
# 基本设置
user = mysql
pid-file = /var/run/mysqld/mysqld.pid
socket = /var/run/mysqld/mysqld.sock
port = 3306
datadir = /var/lib/mysql

# 字符集
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# 连接设置
max_connections = 200
max_connect_errors = 100
wait_timeout = 600
interactive_timeout = 600

# 缓冲池大小（建议物理内存的 50%-70%）
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M

# 慢查询日志
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

[client]
port = 3306
default-character-set = utf8mb4
```

#### Git 配置文件 `.gitconfig`

```ini
[user]
name = Alice
email = alice@example.com

[core]
editor = vim
autocrlf = input

[color]
ui = auto

[alias]
st = status
co = checkout
br = branch
ci = commit
lg = log --oneline --graph --all

[push]
default = current
autoSetupRemote = true

[pull]
rebase = true

[init]
defaultBranch = main
```

---

## 实战对比：同一配置的三种写法

以一个 Web 应用的配置为例：

### TOML 版本（`config.toml`）

```toml
[server]
host = "0.0.0.0"
port = 8080
workers = 4
debug = false

[server.ssl]
enabled = true
cert = "/etc/ssl/cert.pem"
key = "/etc/ssl/key.pem"

[database]
host = "localhost"
port = 5432
name = "myapp"
user = "admin"
password = "secret"
pool_size = 10

[logging]
level = "info"
file = "/var/log/app.log"

[logging.rotation]
max_size = "100MB"
max_files = 10

allowed_origins = [
    "https://example.com",
    "https://www.example.com",
]
```

### YAML 版本（`config.yaml`）

```yaml
server:
  host: "0.0.0.0"
  port: 8080
  workers: 4
  debug: false
  ssl:
    enabled: true
    cert: "/etc/ssl/cert.pem"
    key: "/etc/ssl/key.pem"

database:
  host: localhost
  port: 5432
  name: myapp
  user: admin
  password: secret
  pool_size: 10

logging:
  level: info
  file: /var/log/app.log
  rotation:
    max_size: 100MB
    max_files: 10

allowed_origins:
  - "https://example.com"
  - "https://www.example.com"
```

### INI 版本（`config.ini`）

```ini
[server]
host = 0.0.0.0
port = 8080
workers = 4
debug = false
ssl_enabled = true
ssl_cert = /etc/ssl/cert.pem
ssl_key = /etc/ssl/key.pem

[database]
host = localhost
port = 5432
name = myapp
user = admin
password = secret
pool_size = 10

[logging]
level = info
file = /var/log/app.log
rotation_max_size = 100MB
rotation_max_files = 10

[security]
allowed_origins[] = https://example.com
allowed_origins[] = https://www.example.com
```

---

## 第四部分：常见操作指南（How-to）

### 4.1 如何在 YAML 中正确处理多行文本

```yaml
# 场景：Docker Compose 中的启动命令或环境变量包含多行内容

# | 保留换行符 —— 用于脚本、命令
setup_script: |
  #!/bin/bash
  echo "Starting setup..."
  apt-get update
  apt-get install -y curl

# > 折叠换行为空格 —— 用于长段落的描述
description: >
  This is a very long description
  that will be folded into a single
  line when parsed.

# |- 和 >- 去除末尾换行
clean_script: |-
  line 1
  line 2
# 结果："line 1\nline 2"（没有末尾 \n）
```

### 4.2 如何在 TOML 中组织复杂的嵌套配置

```toml
# 使用点号路径创建深层嵌套，保持文件结构清晰

[default]
timeout = 30
retry = 3

[default.logging]
level = "info"
output = "stdout"

[production]
timeout = 60
retry = 5

[production.logging]
level = "warning"
output = "file"

[production.logging.file]
path = "/var/log/app.log"
max_size = "500MB"
rotation = 7

# 如果嵌套太深，考虑使用内联表简化
[production.database]
connection = { host = "db.prod.internal", port = 5432, pool_size = 20 }
```

### 4.3 如何验证配置文件语法是否正确

```bash
# YAML 验证
# 方法 1：使用 Python 内置模块
python -c "import yaml; yaml.safe_load(open('config.yaml'))"
# 如果没有输出，说明语法正确

# 方法 2：使用在线工具
# https://www.yamllint.com/

# 方法 3：使用 yamllint 命令行工具
pip install yamllint
yamllint config.yaml

# TOML 验证
# 使用 Python 的 tomllib（Python 3.11+）
python -c "import tomllib; tomllib.load(open('config.toml', 'rb'))"

# Docker Compose 配置验证
docker compose config

# Nginx 配置验证
nginx -t
```

### 4.4 如何选择合适的配置格式

```
决策流程：

需要配置文件？
│
├── 简单的 key=value？
│   └── 是 → INI
│       （如 .gitconfig、php.ini、my.cnf）
│
├── 需要数组/嵌套？
│   ├── YAML → Docker Compose、CI/CD、K8s
│   │   （行业标准，工具链支持最好）
│   │
│   └── TOML → Rust/Go/Python 项目配置
│       （类型明确，无缩进陷阱）
│
└── 不确定？
    └── YAML（最通用的选择）
```

---

## 第五部分：语法速查表（Reference）

### 5.1 三种格式语法对比

| 特性 | TOML | YAML | INI |
|------|------|------|-----|
| 注释 | `#` | `#` | `#` 或 `;` |
| 键值对 | `key = value` | `key: value` | `key = value` |
| 字符串 | `"..."` 或 `'...'` | 可省略引号 | 通常不需要引号 |
| 整数 | `42` | `42` | 字符串 `"42"` |
| 浮点数 | `3.14` | `3.14` | 字符串 `"3.14"` |
| 布尔值 | `true` / `false` | `true` / `false` | 字符串 `"true"` |
| 数组 | `[1, 2, 3]` | `- 1` `- 2` `- 3` | 不原生支持 |
| 对象/嵌套 | `[table]` | 缩进 | `[section]` |
| 多行字符串 | `"""..."""` | `\|` 或 `>` | `\` 续行 |
| 空值 | 不支持 | `null` 或 `~` | 不支持 |

### 5.2 YAML 特殊语法速查

| 语法 | 说明 | 示例 |
|------|------|------|
| `---` | 文档分隔符 | `---` |
| `&name` | 定义锚点 | `default: &default` |
| `*name` | 引用锚点 | `<<: *default` |
| `\|` | 保留换行的多行 | `text: \|` |
| `>` | 折叠换行的多行 | `text: >` |
| `!!str` | 强制类型 | `!!str 123` |
| `~` | 空值 | `value: ~` |

### 5.3 TOML 特殊语法速查

| 语法 | 说明 | 示例 |
|------|------|------|
| `[table]` | 定义表 | `[database]` |
| `[[array]]` | 定义表数组 | `[[servers]]` |
| `{k=v}` | 内联表 | `point = {x=1, y=2}` |
| `'''...'''` | 多行字面量字符串 | 不处理转义 |
| `0x` / `0o` / `0b` | 进制前缀 | `0xFF`, `0o755`, `0b1010` |

---

## 总结与下一步

### 你已经学到了什么

| 部分 | 核心收获 |
|------|---------|
| 概述与对比 | 三种格式的定位、优缺点和选择指南 |
| TOML | 表、数组、内联表、数据类型 |
| YAML | 缩进规则、多行文本、锚点与别名、常见陷阱 |
| INI | 节、键值对、常见配置文件（php.ini、my.cnf、.gitconfig） |
| How-to | 多行文本处理、嵌套组织、语法验证、格式选择 |

### 推荐的学习路径

```
✅ 你在这里
│
├──▶ [Docker 入门到进阶](../01-docker/README.md)
│    实战练习 YAML —— 编写 Docker Compose 配置
│
├──▶ [Nginx 入门到进阶](../02-nginx/README.md)
│    阅读 Nginx 的 INI 风格配置文件
│
└──▶ [Linux 常用运维命令](../04-linux-commands/README.md)
     在实际运维中编辑各类配置文件
```

---

## 参考链接

- [TOML 官方规范](https://toml.io/cn/)
- [YAML 官方规范](https://yaml.org/)
- [INI 格式说明](https://en.wikipedia.org/wiki/INI_file)
- [YAML 在线验证工具](https://www.yamllint.com/)
- [TOML/YAML/INI 速查表](https://wangchujiang.com/reference/)
