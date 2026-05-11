# Linux 常用运维命令教程

> 最后更新：2026-05

---

## 目录

- [1. curl — HTTP 请求工具](#1-curl--http-请求工具)
- [2. chmod — 文件权限管理](#2-chmod--文件权限管理)
- [3. ssh — 远程连接](#3-ssh--远程连接)
- [4. tar — 归档压缩](#4-tar--归档压缩)
- [5. zip / unzip — ZIP 压缩](#5-zip--unzip--zip-压缩)
- [6. systemd — 服务管理](#6-systemd--服务管理)
- [附录：其他常用命令速查](#附录其他常用命令速查)
- [参考链接](#参考链接)

---

## 1. curl — HTTP 请求工具

`curl`（Client URL）是一个强大的命令行工具，用于通过各种协议（HTTP、HTTPS、FTP 等）传输数据。是运维和开发中最常用的网络调试工具。

### 1.1 基础用法

```bash
# 最简单的 GET 请求
curl https://example.com

# 输出内容会直接显示在终端
# 如果想保存到文件，使用 -o 或 -O
curl -o page.html https://example.com           # 指定保存文件名
curl -O https://example.com/file.zip             # 使用远程文件名保存

# 只显示响应头（不下载内容）
curl -I https://example.com
# 输出示例：
# HTTP/1.1 200 OK
# Content-Type: text/html; charset=UTF-8
# Server: nginx/1.27.0
# Content-Length: 1256

# 显示详细连接过程（调试用）
curl -v https://example.com
# * Connected to example.com (93.184.216.34) port 443
# > GET / HTTP/1.1
# > Host: example.com
# ...
# < HTTP/1.1 200 OK
# < Content-Type: text/html
# ...
```

### 1.2 GET 请求

```bash
# 基本 GET 请求
curl https://api.example.com/users

# 携带查询参数
curl "https://api.example.com/users?page=1&limit=10"
# 注意：URL 中的 & 需要用引号包裹，否则 shell 会把它当作后台运行

# 添加请求头
curl -H "Accept: application/json" https://api.example.com/users
curl -H "Authorization: Bearer your-token-here" https://api.example.com/users

# 多个请求头
curl \
  -H "Accept: application/json" \
  -H "X-Custom-Header: value" \
  https://api.example.com/users

# 自动跟踪重定向（默认不跟踪）
curl -L https://example.com/redirect-url
```

### 1.3 POST 请求

```bash
# 发送 JSON 数据
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'

# -X 指定请求方法
# -H 添加请求头
# -d 指定请求体数据

# 发送表单数据
curl -X POST https://example.com/login \
  -d "username=admin&password=secret"

# 从文件发送 JSON 数据
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d @user.json                    # @ 表示从文件读取

# 上传文件
curl -X POST https://api.example.com/upload \
  -F "file=@/path/to/file.jpg"     # -F 表单上传，@ 指定文件路径
  -F "description=My photo"        # 可以同时提交其他字段

# 多文件上传
curl -X POST https://api.example.com/upload \
  -F "files[]=@file1.jpg" \
  -F "files[]=@file2.jpg"
```

### 1.4 其他 HTTP 方法

```bash
# PUT —— 全量更新
curl -X PUT https://api.example.com/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Updated", "email": "alice@example.com"}'

# PATCH —— 部分更新
curl -X PATCH https://api.example.com/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Updated"}'

# DELETE —— 删除
curl -X DELETE https://api.example.com/users/1

# HEAD —— 只获取响应头
curl -I https://example.com

# OPTIONS —— 查看支持的 HTTP 方法
curl -X OPTIONS https://api.example.com/users -v
```

### 1.5 认证

```bash
# Basic 认证（用户名:密码）
curl -u admin:password https://api.example.com/admin

# Bearer Token 认证
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  https://api.example.com/users

# API Key 认证（通过请求头）
curl -H "X-API-Key: your-api-key" \
  https://api.example.com/users

# API Key 认证（通过查询参数）
curl "https://api.example.com/users?api_key=your-api-key"
```

### 1.6 实用技巧

```bash
# 格式化 JSON 输出（结合 jq 工具）
curl -s https://api.example.com/users | jq .
# -s 静默模式（不显示进度条）
# jq . 美化 JSON 输出

# 只提取特定字段
curl -s https://api.example.com/users | jq '.[0].name'

# 下载文件并显示进度
curl -# -O https://example.com/large-file.zip

# 限制下载速度
curl --limit-rate 1M -O https://example.com/large-file.zip

# 设置超时时间
curl --connect-timeout 10 --max-time 60 https://example.com
# --connect-timeout: 连接超时 10 秒
# --max-time: 总超时 60 秒

# 重试失败的请求
curl --retry 3 --retry-delay 5 https://example.com

# 指定输出格式（只显示 HTTP 状态码）
curl -s -o /dev/null -w "%{http_code}" https://example.com
# 输出：200

# 显示请求总耗时
curl -s -o /dev/null -w "Time: %{time_total}s\n" https://example.com

# 测试网站是否在线（脚本常用）
http_code=$(curl -s -o /dev/null -w "%{http_code}" https://example.com)
if [ "$http_code" = "200" ]; then
    echo "网站正常"
else
    echo "网站异常，HTTP 状态码：$http_code"
fi

# 静默下载（不输出任何内容）
curl -sS -o /dev/null https://example.com
# -s 静默    -S 即使静默也显示错误
```

### 1.7 Cookie 管理

```bash
# 发送请求时携带 Cookie
curl -b "session=abc123;theme=dark" https://example.com

# 从文件加载 Cookie
curl -b cookies.txt https://example.com

# 将服务器返回的 Cookie 保存到文件
curl -c cookies.txt https://example.com/login \
  -d "user=admin&pass=secret"

# 同时发送和保存 Cookie（模拟完整会话）
curl -b cookies.txt -c cookies.txt https://example.com/dashboard
# 登录后保存 Cookie，后续请求复用 Cookie 实现会话保持
```

### 1.8 SSL / HTTPS 相关

```bash
# 跳过 SSL 证书验证（适用于自签名证书的开发环境，生产环境勿用）
curl -k https://self-signed.example.com

# 指定 CA 证书文件
curl --cacert /path/to/ca.crt https://example.com

# 使用客户端证书（双向 TLS 认证）
curl --cert client.pem --key client-key.pem https://mtls.example.com

# 指定证书类型
curl --cert-type PEM --cert client.pem https://example.com

# 查看 SSL 握手详细信息
curl -v https://example.com 2>&1 | grep -E "SSL|TLS|certificate"
```

### 1.9 断点续传与批量下载

```bash
# 断点续传（继续未完成的下载）
curl -C - -O https://example.com/large-file.zip
# -C - 表示自动从上次中断的位置继续

# 从多个域名下载同名文件
curl -O https://example.com/file.zip -O https://backup.com/file.zip

# 使用通配符批量下载
curl "https://example.com/file_[1-5].log" -o "file_#1.log"
# 下载 file_1.log 到 file_5.log

# 使用大括号匹配多域名
curl "https://www.{example,backup}.com/index.html" -o "site_#1.html"
```

### 1.10 配置文件

```bash
# curl 支持从配置文件读取参数，避免每次输入长命令
# 创建配置文件 ~/.curlrc

# ~/.curlrc 示例内容：
# --silent
# --show-error
# --connect-timeout 10
# --max-time 60
# --location
# user-agent = "Mozilla/5.0 (Custom Agent)"

# 使用指定配置文件
curl -K ~/.curlrc https://example.com
curl --config ~/.curlrc https://example.com
```

---

## 2. chmod — 文件权限管理

`chmod`（Change Mode）用于修改文件和目录的访问权限。

### 2.1 理解 Linux 文件权限

```
# 使用 ls -l 查看文件权限
ls -l
# -rwxr-xr--  1 alice developers 4096 Jan 15 10:00 script.sh
#
# 解读权限位：
#  ┌───┬─────┬─────┬─────┐
#  │ - │ rwx │ r-x │ r-- │
#  └─┬─┴──┬──┴──┬──┴──┬──┘
#    │    │     │     │
#  文件  所属   所属   其他
#  类型  用户   组    用户
#  -普通 rwx   r-x   r--
#  d目录 读写   读    读
#  l链接 执行   执行
```

**权限说明：**

| 权限          | 对文件的含义 | 对目录的含义          | 数字表示 |
| ------------- | ------------ | --------------------- | -------- |
| `r` (read)    | 读取文件内容 | 列出目录下的文件      | 4        |
| `w` (write)   | 修改文件内容 | 在目录中创建/删除文件 | 2        |
| `x` (execute) | 作为程序执行 | 进入目录（cd）        | 1        |

**常见权限组合：**

| 数字 | 二进制 | 权限  | 说明      |
| ---- | ------ | ----- | --------- |
| 0    | 000    | `---` | 无权限    |
| 1    | 001    | `--x` | 仅执行    |
| 2    | 010    | `-w-` | 仅写入    |
| 4    | 100    | `r--` | 仅读取    |
| 5    | 101    | `r-x` | 读取+执行 |
| 6    | 110    | `rw-` | 读取+写入 |
| 7    | 111    | `rwx` | 全部权限  |

### 2.2 数字方式修改权限

```bash
# 格式：chmod [选项] 权限数字 文件

# 设置权限为 rwxr-xr-x (755)
# 所有者：rwx (7=4+2+1)
# 所属组：r-x (5=4+0+1)
# 其他人：r-x (5=4+0+1)
chmod 755 script.sh

# 设置权限为 rw-r--r-- (644)
# 所有者：rw- (6=4+2+0)
# 所属组：r-- (4)
# 其他人：r-- (4)
chmod 644 config.yaml

# 设置权限为 rwx------ (700)
# 仅所有者有全部权限
chmod 700 private.key

# 设置权限为 rw------- (600)
# 仅所有者可读写
chmod 600 .env

# 递归修改目录及其内容的权限
chmod -R 755 /var/www/html/

# 常见权限设置：
chmod 755 script.sh       # 可执行脚本
chmod 644 index.html      # 网页文件
chmod 600 config.ini      # 配置文件（含敏感信息）
chmod 700 ~/.ssh/         # SSH 目录
chmod 600 ~/.ssh/id_rsa   # SSH 私钥
```

### 2.3 符号方式修改权限

```bash
# 格式：chmod [ugoa][+-=][rwx] 文件
# u = user（所有者）
# g = group（所属组）
# o = other（其他人）
# a = all（所有人，默认值）

# + 添加权限
chmod u+x script.sh          # 给所有者添加执行权限
chmod g+w config.yaml        # 给所属组添加写权限
chmod o+r index.html         # 给其他人添加读权限
chmod a+x deploy.sh          # 给所有人添加执行权限

# - 移除权限
chmod o-w config.yaml        # 移除其他人的写权限
chmod g-x script.sh          # 移除所属组的执行权限

# = 设置精确权限（覆盖原有）
chmod u=rwx,go=rx script.sh  # 所有者 rwx，其他人 rx
chmod go= config.ini         # 移除组和其他人的所有权限

# 同时修改多个
chmod u+rwx,g+rx,o+r file.txt

# 参考其他文件设置权限
chmod --reference=template.conf app.conf
```

---

## 3. ssh — 远程连接

SSH（Secure Shell）是运维中最基本的远程管理工具，用于安全地连接到远程服务器。

### 3.1 基本连接

```bash
# 基本连接（使用密码认证）
ssh username@server-ip
ssh root@192.168.1.100
ssh user@example.com

# 指定端口（默认端口 22）
ssh -p 2222 user@192.168.1.100

# 使用密钥文件连接
ssh -i ~/.ssh/my_key.pem user@192.168.1.100

# 在远程服务器执行命令（不进入交互式 shell）
ssh user@192.168.1.100 "uname -a"
ssh user@192.168.1.100 "df -h"
ssh user@192.168.1.100 "docker ps"
```

### 3.2 SSH 密钥配置（免密登录）

```bash
# 1. 生成 SSH 密钥对（推荐 ed25519 算法）
ssh-keygen -t ed25519 -C "your-email@example.com"
# 按 Enter 使用默认路径 ~/.ssh/id_ed25519
# 可以设置密码短语（passphrase），也可以留空

# 旧版系统不支持 ed25519 时使用 RSA
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 2. 将公钥复制到远程服务器
ssh-copy-id user@192.168.1.100
# 这会把 ~/.ssh/id_ed25519.pub 追加到远程的 ~/.ssh/authorized_keys

# 3. 如果 ssh-copy-id 不可用，手动复制
cat ~/.ssh/id_ed25519.pub | ssh user@192.168.1.100 \
  "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# 4. 测试免密登录
ssh user@192.168.1.100
# 应该不需要输入密码就能直接登录
```

### 3.3 SSH 配置文件

```bash
# 编辑 SSH 客户端配置文件
# ~/.ssh/config

# 基本配置
Host myserver
    HostName 192.168.1.100
    User deploy
    Port 22
    IdentityFile ~/.ssh/id_ed25519

# 配置后可以直接使用别名连接
ssh myserver    # 等价于 ssh -i ~/.ssh/id_ed25519 deploy@192.168.1.100

# 多个服务器配置
Host web-prod
    HostName web.example.com
    User admin
    IdentityFile ~/.ssh/prod_key

Host db-prod
    HostName db.example.com
    User postgres
    Port 5432
    IdentityFile ~/.ssh/prod_key

Host dev
    HostName dev.example.com
    User developer
    IdentityFile ~/.ssh/dev_key

# 通配符配置（所有匹配的服务器共享配置）
Host *.example.com
    User admin
    IdentityFile ~/.ssh/company_key
    ServerAliveInterval 60       # 每 60 秒发送心跳包
    ServerAliveCountMax 3        # 3 次无响应则断开

# 通过跳板机连接
Host bastion
    HostName jump.example.com
    User jump-user

Host internal-server
    HostName 10.0.0.50
    User admin
    ProxyJump bastion            # 通过 bastion 跳转
```

### 3.4 SCP 文件传输

```bash
# 上传文件到远程服务器
scp local-file.txt user@192.168.1.100:/remote/path/

# 上传目录（-r 递归）
scp -r local-directory/ user@192.168.1.100:/remote/path/

# 从远程服务器下载文件
scp user@192.168.1.100:/remote/file.txt ./local-path/

# 下载目录
scp -r user@192.168.1.100:/remote/directory/ ./local-path/

# 指定端口
scp -P 2222 file.txt user@192.168.1.100:/remote/path/

# 使用 SSH 配置中的别名
scp file.txt myserver:/remote/path/
```

### 3.5 SSH 安全加固

```bash
# 编辑 SSH 服务器配置文件
# /etc/ssh/sshd_config

# 禁止 root 直接登录
PermitRootLogin no

# 禁止密码登录（只允许密钥）
PasswordAuthentication no
PubkeyAuthentication yes

# 修改默认端口（减少扫描攻击）
Port 2222

# 限制允许登录的用户
AllowUsers deploy admin

# 设置登录超时
LoginGraceTime 30
MaxAuthTries 3

# 禁用空密码
PermitEmptyPasswords no

# 修改后重启 SSH 服务
sudo systemctl restart sshd
```

### 3.6 SSH 端口转发

SSH 端口转发（Port Forwarding / 隧道）是通过 SSH 加密通道在本地和远程之间转发网络流量的技术。

**本地端口转发（Local Port Forwarding）：** 将本地端口通过 SSH 隧道转发到远程目标服务器

```bash
# 语法：ssh -L [本地IP:]本地端口:目标IP:目标端口 用户名@SSH服务器 -N
# -N 表示不执行远程命令，只建立隧道

# 示例：将本地 4000 端口转发到内网服务器 192.168.1.10:80
ssh -L 4000:192.168.1.10:80 user@jump-server -N
# 访问 localhost:4000 等于访问内网的 192.168.1.10:80

# 访问远程 MySQL 数据库（不需要暴露 3306 端口）
ssh -L 3306:localhost:3306 user@db-server -N
# 然后可以用 mysql -h 127.0.0.1 连接远程数据库
```

**远程端口转发（Remote Port Forwarding）：** 让远程 SSH 服务器上的端口转发到本地服务

```bash
# 语法：ssh -R [SSH服务器IP:]远程端口:本地IP:本地端口 用户名@SSH服务器 -N

# 示例：让远程服务器的 5000 端口映射到本地的 MySQL
ssh -R 5000:localhost:3306 user@remote-server -N
# 远程服务器上访问 localhost:5000 即可连接你本地的 MySQL

# 常用场景：将本地开发服务暴露给外部测试
ssh -R 8080:localhost:3000 user@public-server -N
```

**动态端口转发（SOCKS 代理）：** 将本地端口变成 SOCKS5 代理

```bash
# 开启本地 1080 端口作为 SOCKS5 代理
ssh -D 1080 -N user@ssh-server
# 所有通过 SOCKS5 代理的流量都会经过 SSH 服务器转发

# 配合 curl 验证代理是否生效
curl --socks5 127.0.0.1:1080 https://ifconfig.me
# 如果返回的是 SSH 服务器的公网 IP，说明代理正常
```

### 3.7 known_hosts 管理

```bash
# SSH 会在首次连接新服务器时记录其指纹到 ~/.ssh/known_hosts
# 如果服务器重装或 IP 变更，会出现 "WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!" 错误

# 从 known_hosts 中删除指定主机（解决指纹不匹配问题）
ssh-keygen -R 192.168.1.100
ssh-keygen -R hostname.example.com

# 在 known_hosts 中搜索指定主机
ssh-keygen -F 192.168.1.100

# 跳过主机密钥检查（仅用于临时测试，不推荐日常使用）
ssh -o StrictHostKeyChecking=no user@192.168.1.100
```

---

## 4. tar — 归档压缩

`tar`（Tape Archive）是 Linux 下最常用的归档工具，通常与 `gzip` 或 `bzip2` 配合使用进行压缩。

### 4.1 基本概念

```
归档（Archive）: 将多个文件合并成一个文件
压缩（Compress）: 减小文件大小

tar 只是归档工具，本身不压缩
通常组合使用：
  tar + gzip  → .tar.gz 或 .tgz    （最常见）
  tar + bzip2 → .tar.bz2           （压缩率更高但更慢）
  tar + xz    → .tar.xz            （压缩率最高但最慢）
```

### 4.2 创建归档

```bash
# 创建 gzip 压缩的归档（最常用）
tar -czf archive.tar.gz /path/to/directory/
# -c  创建归档 (create)
# -z  使用 gzip 压缩
# -f  指定归档文件名 (file)

# 显示创建过程
tar -czvf archive.tar.gz /path/to/directory/
# -v  显示详细过程 (verbose)

# 创建 bzip2 压缩的归档（压缩率更高）
tar -cjf archive.tar.bz2 /path/to/directory/
# -j  使用 bzip2 压缩

# 创建 xz 压缩的归档（压缩率最高）
tar -cJf archive.tar.xz /path/to/directory/
# -J  使用 xz 压缩

# 只归档不压缩
tar -cf archive.tar /path/to/directory/

# 排除特定文件
tar -czf archive.tar.gz --exclude='*.log' --exclude='node_modules' /path/to/project/

# 排除文件列表（从文件读取排除规则）
tar -czf archive.tar.gz -X exclude.txt /path/to/project/

# 只打包特定类型的文件
tar -czf logs.tar.gz /var/log/*.log

# 追加文件到已有归档（仅未压缩的 tar）
tar -rf archive.tar newfile.txt
```

### 4.3 解压归档

```bash
# 解压 .tar.gz 文件（最常用）
tar -xzf archive.tar.gz
# -x  解压 (extract)

# 解压到指定目录
tar -xzf archive.tar.gz -C /target/directory/

# 显示解压过程
tar -xzvf archive.tar.gz

# 解压 .tar.bz2 文件
tar -xjf archive.tar.bz2

# 解压 .tar.xz 文件
tar -xJf archive.tar.xz

# 解压未压缩的 .tar 文件
tar -xf archive.tar

# 只解压特定文件
tar -xzf archive.tar.gz path/to/specific/file.txt

# 查看归档内容（不解压）
tar -tzf archive.tar.gz
tar -tvf archive.tar.gz    # 显示详细信息（权限、大小等）
```

### 4.4 实用示例

```bash
# 备份网站目录
tar -czf backup_$(date +%Y%m%d).tar.gz /var/www/html/
# 生成文件名如：backup_20240115.tar.gz

# 备份并排除不必要文件
tar -czf project-backup.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='__pycache__' \
  --exclude='*.pyc' \
  /home/user/project/

# 通过 SSH 远程备份（直接传输，不占用本地空间）
tar -czf - /path/to/backup/ | ssh user@remote-server "cat > /remote/backup.tar.gz"

# 解压远程备份到本地
ssh user@remote-server "tar -czf - /path/to/backup/" | tar -xzf - -C /local/path/
```

### 4.5 速查表

| 操作           | 命令                             |
| -------------- | -------------------------------- |
| 创建 .tar.gz   | `tar -czf file.tar.gz 目录/`     |
| 创建 .tar.bz2  | `tar -cjf file.tar.bz2 目录/`    |
| 创建 .tar.xz   | `tar -cJf file.tar.xz 目录/`     |
| 解压 .tar.gz   | `tar -xzf file.tar.gz`           |
| 解压 .tar.bz2  | `tar -xjf file.tar.bz2`          |
| 解压 .tar.xz   | `tar -xJf file.tar.xz`           |
| 查看内容       | `tar -tzf file.tar.gz`           |
| 解压到指定目录 | `tar -xzf file.tar.gz -C /目录/` |

---

## 5. zip / unzip — ZIP 压缩

ZIP 格式在 Windows 和 Linux 之间交换文件时最常用。

### 5.1 压缩

```bash
# 安装 zip/unzip（如果未安装）
sudo apt-get install -y zip unzip

# 压缩文件
zip archive.zip file.txt

# 压缩多个文件
zip archive.zip file1.txt file2.txt file3.txt

# 压缩目录（-r 递归）
zip -r archive.zip directory/

# 压缩时排除特定文件
zip -r archive.zip directory/ -x "directory/node_modules/*" -x "directory/.git/*"

# 添加文件到已有 ZIP
zip archive.zip newfile.txt

# 设置压缩级别（0-9，0 不压缩，9 最高压缩）
zip -9 -r archive.zip directory/

# 加密压缩
zip -e -r archive.zip directory/
# 会提示输入密码

# 将目录压缩并分割成指定大小
zip -r -s 100m archive.zip large-directory/
# 分割成每个最大 100MB 的文件
```

### 5.2 解压

```bash
# 解压到当前目录
unzip archive.zip

# 解压到指定目录
unzip archive.zip -d /target/directory/

# 查看 ZIP 内容（不解压）
unzip -l archive.zip

# 测试 ZIP 文件完整性
unzip -t archive.zip

# 只解压特定文件
unzip archive.zip "path/to/file.txt"

# 覆盖已存在文件时不提示
unzip -o archive.zip

# 覆盖已存在文件时跳过
unzip -n archive.zip

# 静默解压
unzip -q archive.zip
```

### 5.3 其他实用操作

```bash
# 更新 ZIP 中的文件（只压缩有变化或新增的文件）
zip -u archive.zip updated-file.txt

# 从 ZIP 中删除指定文件
zip -d archive.zip unwanted-file.txt

# 修复损坏的 ZIP 文件
zip -F archive.zip --out fixed.zip
# -FF 尝试更积极地修复
zip -FF archive.zip --out fixed.zip

# 处理中文文件名乱码问题（指定编码为 UTF-8）
unzip -O GBK archive.zip
# 在 Linux 上解压 Windows 创建的 ZIP 时常见中文乱码，用 GBK 编码解压

# 压缩时指定 UTF-8 编码
zip -O utf-8 -r archive.zip directory/

# 不包含目录结构（只压缩文件，不保留目录层级）
zip -j archive.zip /path/to/dir/*.txt

# 将符号链接作为链接存储（而非跟随链接压缩实际文件）
zip -y archive.zip symlink-file
```

### 5.4 tar vs zip 对比

| 特性     | tar.gz                     | zip                        |
| -------- | -------------------------- | -------------------------- |
| 压缩率   | 更高                       | 一般                       |
| 跨平台   | Linux 原生支持             | Windows/Linux 都支持       |
| 随机访问 | 不支持（需要解压整个文件） | 支持（可以只提取单个文件） |
| 适用场景 | Linux 服务器之间           | 跨平台文件交换             |

---

## 6. systemd — 服务管理

systemd 是现代 Linux 系统的初始化系统和服务管理器，几乎所有的主流发行版（Debian、Ubuntu、CentOS 等）都使用它。

### 6.1 服务管理基本命令（systemctl）

```bash
# 启动服务
sudo systemctl start nginx

# 停止服务
sudo systemctl stop nginx

# 重启服务（先停止再启动）
sudo systemctl restart nginx

# 重新加载配置（不中断服务，类似 nginx -s reload）
sudo systemctl reload nginx

# 查看服务状态
sudo systemctl status nginx
# 输出示例：
# ● nginx.service - A high performance web server
#      Loaded: loaded (/lib/systemd/system/nginx.service; enabled; preset: enabled)
#      Active: active (running) since Mon 2024-01-15 10:00:00 CST; 1h ago
#    Main PID: 1234 (nginx)
#       Tasks: 5 (limit: 4915)
#      Memory: 4.5M
#         CPU: 1.234s
#      CGroup: /system.slice/nginx.service
#              ├─1234 "nginx: master process /usr/sbin/nginx"
#              ├─1235 "nginx: worker process"
#              └─1236 "nginx: worker process"

# 设置开机自启
sudo systemctl enable nginx

# 取消开机自启
sudo systemctl disable nginx

# 启用并立即启动（组合操作）
sudo systemctl enable --now nginx

# 禁用并立即停止
sudo systemctl disable --now nginx

# 查看服务是否开机自启
sudo systemctl is-enabled nginx

# 查看服务是否正在运行
sudo systemctl is-active nginx
```

### 6.2 查看和管理所有服务

```bash
# 列出所有正在运行的服务
sudo systemctl list-units --type=service --state=running

# 列出所有服务（包括未运行的）
sudo systemctl list-units --type=service --all

# 列出失败的服务（排查问题时很有用）
sudo systemctl --failed

# 查看服务的依赖关系
sudo systemctl list-dependencies nginx

# 查看服务的底层配置文件路径
sudo systemctl show nginx
```

### 6.3 查看日志（journalctl）

```bash
# 查看所有系统日志
sudo journalctl

# 查看特定服务的日志
sudo journalctl -u nginx

# 实时跟踪日志（类似 tail -f）
sudo journalctl -u nginx -f

# 查看最近 100 行日志
sudo journalctl -u nginx -n 100

# 按时间范围查看
sudo journalctl --since "2024-01-15 10:00:00" --until "2024-01-15 12:00:00"
sudo journalctl --since "1 hour ago"
sudo journalctl --since "today"

# 只看内核日志
sudo journalctl -k

# 只看错误级别以上的日志
sudo journalctl -p err

# 按优先级过滤（从高到低）：
# emerg (0) - 紧急
# alert (1) - 警报
# crit  (2) - 严重
# err   (3) - 错误
# warning (4) - 警告
# notice (5) - 通知
# info  (6) - 信息
# debug (7) - 调试

# 以 JSON 格式输出（方便脚本处理）
sudo journalctl -u nginx -o json

# 只显示最近一次启动的日志
sudo journalctl -b

# 清理旧日志（释放磁盘空间）
sudo journalctl --vacuum-time=7d       # 只保留 7 天
sudo journalctl --vacuum-size=500M     # 只保留 500MB
```

### 6.4 编写自定义 systemd 服务

创建一个 systemd 服务文件来管理你的应用：

```bash
# 创建服务文件
sudo nano /etc/systemd/system/myapp.service
```

**简单示例 —— 管理一个 Python Web 应用：**

```ini
[Unit]
# 服务的描述信息
Description=My Python Web Application
After=network.target postgresql.service
# After: 在这些服务启动之后再启动
# Before: 在这些服务启动之前启动
Wants=postgresql.service
# Wants: 弱依赖（即使该服务启动失败，本服务也会启动）
# Requires: 强依赖（该服务失败则本服务也停止）

[Service]
# 服务类型
Type=simple
# simple（默认）: ExecStart 启动后即认为服务就绪
# forking: ExecStart 会 fork 子进程后退出
# notify: 服务会通过 sd_notify 通知 systemd 自己就绪
# idle: 所有排队任务完成后再启动

# 执行用户和组
User=appuser
Group=appgroup

# 工作目录
WorkingDirectory=/opt/myapp

# 启动命令
ExecStart=/opt/myapp/venv/bin/gunicorn \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --timeout 120 \
    app:app

# 启动前执行的命令
# ExecStartPre=/opt/myapp/venv/bin/python manage.py migrate

# 重启前执行的命令
# ExecStop=/opt/myapp/scripts/graceful-shutdown.sh

# 重启策略
Restart=always
RestartSec=5
# always: 总是重启（无论退出码）
# on-failure: 仅异常退出时重启
# on-success: 仅正常退出时重启
# no: 不自动重启

# 环境变量
Environment="DATABASE_URL=postgresql://user:pass@localhost/mydb"
Environment="FLASK_ENV=production"
# 或从文件加载
EnvironmentFile=/opt/myapp/.env

# 安全加固
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/myapp/data /var/log/myapp

# 资源限制
LimitNOFILE=65535

# 标准输出和错误日志
StandardOutput=journal
StandardError=journal
SyslogIdentifier=myapp

[Install]
# 设置开机自启时，加入哪个目标
WantedBy=multi-user.target
```

**管理自定义服务：**

```bash
# 重新加载 systemd 配置（每次修改 .service 文件后都要执行！）
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start myapp

# 查看状态
sudo systemctl status myapp

# 查看日志
sudo journalctl -u myapp -f

# 设置开机自启
sudo systemctl enable myapp

# 修改 .service 文件后的完整操作流程
sudo nano /etc/systemd/system/myapp.service     # 1. 编辑
sudo systemctl daemon-reload                      # 2. 重新加载
sudo systemctl restart myapp                      # 3. 重启服务
sudo systemctl status myapp                       # 4. 检查状态
```

### 6.5 Docker 服务示例

```ini
[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
After=network-online.target docker.socket firewalld.service
Wants=network-online.target

[Service]
Type=notify
ExecStart=/usr/bin/dockerd
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
TasksMax=infinity
TimeoutStartSec=0
Delegate=yes
KillMode=process
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### 6.6 Target（运行级别）

systemd 使用 "target" 替代了传统 SysVinit 的运行级别（runlevel）概念。

**运行级别对照表：**

| SysVinit 运行级别    | systemd Target      | 说明                     |
| -------------------- | ------------------- | ------------------------ |
| `0`                  | `poweroff.target`   | 关机                     |
| `1` / `s` / `single` | `rescue.target`     | 单用户模式（救援模式）   |
| `2` / `4`            | `multi-user.target` | 多用户模式（无图形界面） |
| `3`                  | `multi-user.target` | 多用户命令行模式         |
| `5`                  | `graphical.target`  | 多用户图形界面模式       |
| `6`                  | `reboot.target`     | 重启                     |
| `emergency`          | `emergency.target`  | 紧急救援 Shell           |

```bash
# 查看当前默认启动目标
systemctl get-default
# 输出：graphical.target

# 设置默认启动为命令行模式
sudo systemctl set-default multi-user.target

# 设置默认启动为图形界面模式
sudo systemctl set-default graphical.target

# 切换到救援模式（不需要重启）
sudo systemctl isolate rescue.target

# 切换到图形界面
sudo systemctl isolate graphical.target
```

### 6.7 SysVinit 到 Systemd 命令对照

许多旧教程仍在使用 `service` 和 `chkconfig` 命令，以下是新旧命令对照表：

| 旧命令（SysVinit）      | 新命令（systemd）                          | 说明              |
| ----------------------- | ------------------------------------------ | ----------------- |
| `service nginx start`   | `systemctl start nginx`                    | 启动服务          |
| `service nginx stop`    | `systemctl stop nginx`                     | 停止服务          |
| `service nginx restart` | `systemctl restart nginx`                  | 重启服务          |
| `service nginx reload`  | `systemctl reload nginx`                   | 重新加载配置      |
| `service nginx status`  | `systemctl status nginx`                   | 查看服务状态      |
| `chkconfig nginx on`    | `systemctl enable nginx`                   | 设置开机自启      |
| `chkconfig nginx off`   | `systemctl disable nginx`                  | 取消开机自启      |
| `chkconfig nginx`       | `systemctl is-enabled nginx`               | 查看是否开机自启  |
| `chkconfig --list`      | `systemctl list-unit-files --type=service` | 列出所有服务      |
| `chkconfig --add nginx` | `systemctl daemon-reload`                  | 添加/重载服务配置 |

### 6.8 系统状态管理

```bash
# 重启系统
sudo systemctl reboot

# 关机
sudo systemctl poweroff

# 挂起（待机）
sudo systemctl suspend

# 休眠（保存到磁盘）
sudo systemctl hibernate

# 查看系统启动耗时
systemd-analyze
# Startup finished in 2.345s (kernel) + 5.678s (userspace) = 8.023s

# 查看各服务启动耗时（排查启动慢的问题）
systemd-analyze blame

# 查看启动时的关键路径（依赖链）
systemd-analyze critical-chain
```

---

## 附录：其他常用命令速查

### 文件操作

```bash
# 查看文件内容
cat file.txt                # 显示全部内容
less file.txt               # 分页查看（按 q 退出）
head -n 20 file.txt         # 显示前 20 行
tail -n 20 file.txt         # 显示后 20 行
tail -f /var/log/app.log    # 实时跟踪日志

# 搜索文件
find / -name "nginx.conf"              # 按名称搜索
find /var/log -name "*.log" -mtime +7  # 查找 7 天前的日志
find / -type f -size +100M             # 查找大于 100MB 的文件

# 文本搜索
grep "error" /var/log/app.log          # 在文件中搜索
grep -r "TODO" /path/to/project/       # 递归搜索
grep -i "error" app.log                # 忽略大小写
grep -n "error" app.log                # 显示行号

# 文件比较
diff file1.txt file2.txt
```

### 系统信息

```bash
# 系统信息
uname -a                    # 内核信息
cat /etc/os-release         # 操作系统信息
hostname                    # 主机名
uptime                      # 运行时间

# CPU 信息
nproc                       # CPU 核心数
lscpu                       # 详细 CPU 信息

# 内存信息
free -h                     # 内存使用情况
#               total        used        free      shared  buff/cache   available
# Mem:           7.8Gi       2.1Gi       3.5Gi       256Mi       2.2Gi       5.2Gi

# 磁盘信息
df -h                       # 磁盘使用情况
du -sh /var/log/            # 目录大小
du -sh * | sort -rh | head  # 当前目录下最大的文件/目录

# 进程管理
ps aux                      # 查看所有进程
top                         # 实时监控（按 q 退出）
htop                        # 更友好的实时监控（需安装）
kill -9 1234                # 强制终止进程
kill -15 1234               # 优雅终止进程（SIGTERM）
```

### 网络调试

```bash
# 端口查看
ss -tlnp                    # 查看所有监听的 TCP 端口
# -t TCP  -l 监听中  -n 数字格式  -p 显示进程

netstat -tlnp               # 旧版命令（功能同上）

# 网络连接测试
ping example.com            # 测试连通性
traceroute example.com      # 路由跟踪

# DNS 查询
dig example.com             # DNS 查询
nslookup example.com        # DNS 查询（更简单）

# 下载文件
wget https://example.com/file.zip            # 下载文件
wget -c https://example.com/file.zip         # 断点续传
```

---

## 参考链接

- [curl 官方文档](https://curl.se/docs/)
- [OpenSSH 文档](https://www.openssh.com/manual.html)
- [systemd 官方文档](https://www.freedesktop.org/wiki/Software/systemd/)
- [Linux 命令速查表](https://wangchujiang.com/reference/docs/linux-command.html)
- [curl 速查表](https://wangchujiang.com/reference/docs/curl.html)
- [chmod 速查表](https://wangchujiang.com/reference/docs/chmod.html)
- [ssh 速查表](https://wangchujiang.com/reference/docs/ssh.html)
- [tar 速查表](https://wangchujiang.com/reference/docs/tar.html)
- [zip 速查表](https://wangchujiang.com/reference/docs/zip.html)
- [systemd 速查表](https://wangchujiang.com/reference/docs/systemd.html)
