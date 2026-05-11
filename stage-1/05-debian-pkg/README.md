# Debian 包管理器教程

> 适用版本：Debian 12 (Bookworm) / Debian 13 (Trixie) / Ubuntu 22.04+  
> 最后更新：2026-05

---

## 目录

- [1. 包管理器概述](#1-包管理器概述)
- [2. apt — 高级包管理工具](#2-apt--高级包管理工具)
- [3. apt-get 与 apt-cache](#3-apt-get-与-apt-cache)
- [4. dpkg — 底层包管理工具](#4-dpkg--底层包管理工具)
- [5. 软件源配置](#5-软件源配置)
- [6. 常见运维场景](#6-常见运维场景)
- [参考链接](#参考链接)

---

## 1. 包管理器概述

Debian 系统使用 **APT（Advanced Package Tool）** 作为包管理器，它是一个完整的软件包管理系统，负责软件的安装、更新、卸载和依赖管理。

```
Debian 包管理器层级：

  用户
   │
   ▼
  apt / apt-get / apt-cache     ← 高级前端（推荐使用 apt）
   │
   ▼
  dpkg                          ← 底层工具（直接操作 .deb 文件）
   │
   ▼
  .deb 软件包文件                ← Debian 包格式
```

**命令选择指南：**

| 场景 | 推荐命令 |
|------|---------|
| 日常安装/卸载/更新软件 | `apt` |
| 脚本中使用（输出稳定） | `apt-get` |
| 安装本地 .deb 文件 | `dpkg -i` 或 `apt install ./file.deb` |
| 查询包信息 | `apt show` / `apt-cache policy` |

---

## 2. apt — 高级包管理工具

`apt` 是 Debian/Ubuntu 中推荐的包管理命令行工具，它整合了 `apt-get` 和 `apt-cache` 的常用功能，提供了更友好的交互体验。

### 2.1 更新软件源索引

```bash
# 更新本地软件包索引（从配置的软件源下载最新的包列表）
# ⚠️ 安装或升级软件前务必先执行此命令！
sudo apt update

# 输出示例：
# Hit:1 http://deb.debian.org/debian bookworm InRelease
# Hit:2 http://deb.debian.org/debian bookworm-updates InRelease
# Hit:3 http://security.debian.org/debian-security bookworm-security InRelease
# Reading package lists... Done
# All packages are up to date.
```

### 2.2 安装软件包

```bash
# 安装一个软件包
sudo apt install nginx

# 安装多个软件包
sudo apt install nginx curl git vim

# 安装指定版本的软件包
sudo apt install nginx=1.27.0-1

# 安装时不弹出交互式对话框（脚本中常用）
sudo DEBIAN_FRONTEND=noninteractive apt install -y nginx
# -y 自动回答 yes
# DEBIAN_FRONTEND=noninteractive 禁用交互式配置界面

# 重新安装已安装的包（修复损坏的安装）
sudo apt install --reinstall nginx

# 安装但不升级已安装的包
sudo apt install nginx --no-upgrade

# 只升级不安装（如果包不存在则不操作）
sudo apt install nginx --only-upgrade

# 安装本地 .deb 文件（自动处理依赖，推荐）
sudo apt install ./package.deb
# 注意：./ 前缀很重要，告诉 apt 这是本地文件而不是包名
```

### 2.3 卸载软件包

```bash
# 卸载软件包（保留配置文件）
sudo apt remove nginx

# 卸载软件包并删除配置文件（彻底卸载）
sudo apt purge nginx

# 卸载并清理所有相关配置
sudo apt purge nginx nginx-common nginx-full

# 自动清理不再需要的依赖包
sudo apt autoremove

# 彻底卸载（purge + autoremove 一步到位）
sudo apt purge nginx && sudo apt autoremove

# 卸载时自动回答 yes
sudo apt remove -y nginx
```

### 2.4 升级软件包

```bash
# 升级所有已安装的软件包（不删除旧包、不安装新依赖）
sudo apt update && sudo apt upgrade -y

# 完整升级（可能删除旧包、安装新依赖，处理依赖变更）
# ⚠️ 谨慎使用，建议先查看会做什么变更
sudo apt update && sudo apt full-upgrade

# 只升级特定的软件包
sudo apt install --only-upgrade nginx

# 查看哪些包可以升级
apt list --upgradable

# 升级前模拟（不实际执行，查看会做什么）
apt upgrade --simulate
```

### 2.5 搜索与查询

```bash
# 按关键词搜索软件包
apt search nginx
apt search "web server"

# 搜索已安装的包
apt search nginx --installed

# 查看软件包详细信息
apt show nginx
# 输出包含：版本、依赖、描述、大小、主页等

# 列出所有已安装的软件包
apt list --installed

# 列出可升级的软件包
apt list --upgradable

# 列出所有软件包（包括未安装的）
apt list --all-versions

# 检查某个软件包是否已安装
apt list --installed | grep nginx

# 查看软件包的依赖关系
apt depends nginx

# 查看哪些包依赖某个软件包（反向依赖）
apt rdepends nginx
```

### 2.6 清理缓存

```bash
# 清理下载的包缓存（/var/cache/apt/archives/）
sudo apt clean

# 只清理过时的包缓存（保留当前版本的缓存）
sudo apt autoclean

# 删除不再需要的依赖包
sudo apt autoremove

# 删除不再需要的依赖包，包括配置文件
sudo apt autoremove --purge

# 查看缓存占用的磁盘空间
du -sh /var/cache/apt/archives/
```

---

## 3. apt-get 与 apt-cache

`apt-get` 和 `apt-cache` 是 `apt` 的底层命令。在编写脚本时推荐使用 `apt-get`，因为它的输出格式更稳定。

### 3.1 apt-get 常用命令

```bash
# 更新软件源
sudo apt-get update

# 安装软件包
sudo apt-get install -y nginx
# -y 自动确认

# 卸载软件包
sudo apt-get remove nginx

# 彻底卸载（包括配置文件）
sudo apt-get purge nginx

# 升级所有包
sudo apt-get upgrade -y

# 完整升级
sudo apt-get dist-upgrade -y

# 清理
sudo apt-get autoremove -y
sudo apt-get autoclean
sudo apt-get clean

# 下载软件包但不安装（只下载 .deb 文件到缓存目录）
sudo apt-get download nginx

# 只下载依赖不安装
sudo apt-get install --download-only nginx

# 修复损坏的依赖关系
sudo apt-get install -f
# 或
sudo apt-get --fix-broken install
```

### 3.2 apt-cache 常用命令

```bash
# 搜索软件包
apt-cache search nginx

# 查看软件包信息
apt-cache show nginx

# 查看软件包的依赖
apt-cache depends nginx

# 查看反向依赖
apt-cache rdepends nginx

# 查看软件包的安装候选版本
apt-cache policy nginx
# 输出示例：
# nginx:
#   Installed: 1.26.0-1~bookworm
#   Candidate: 1.26.0-1~bookworm
#   Version table:
#  *** 1.26.0-1~bookworm 500
#         500 http://deb.debian.org/debian bookworm/main amd64 Packages
#         100 /var/lib/dpkg/status

# 查看软件包的安装状态和版本
apt-cache madison nginx
# 输出所有可用版本：
# nginx | 1.27.0-1~bookworm | http://deb.debian.org/debian bookworm/main amd64 Packages
# nginx | 1.26.0-1~bookworm | http://deb.debian.org/debian bookworm/main amd64 Packages
```

---

## 4. dpkg — 底层包管理工具

`dpkg` 是 Debian 包管理系统的底层工具，直接操作 `.deb` 文件。它不会自动处理依赖关系。

### 4.1 安装与管理 .deb 文件

```bash
# 安装 .deb 文件
sudo dpkg -i package.deb
# -i = --install

# 如果报依赖错误，使用 apt 修复
sudo apt-get install -f

# 卸载软件包
sudo dpkg -r package-name       # 保留配置文件
sudo dpkg --purge package-name  # 删除配置文件

# 查看已安装的所有包
dpkg -l
dpkg -l | grep nginx

# 查看某个已安装包的详细信息
dpkg -s nginx

# 查看已安装包的文件列表（安装了哪些文件）
dpkg -L nginx

# 查看某个文件属于哪个包
dpkg -S /usr/sbin/nginx

# 查看 .deb 文件信息（不安装）
dpkg -I package.deb

# 查看 .deb 文件包含的文件列表（不安装）
dpkg -c package.deb

# 解压 .deb 文件（不安装，提取文件）
dpkg-deb -x package.deb /target/directory/
```

### 4.2 dpkg vs apt 对比

```bash
# dpkg -i 的问题：不会自动处理依赖
sudo dpkg -i some-package.deb
# 如果缺少依赖，会报错：
# dpkg: error processing package some-package (--install):
#  dependency problems - leaving unconfigured

# 解决方案 1：使用 apt install（推荐）
sudo apt install ./some-package.deb
# apt 会自动解决依赖问题

# 解决方案 2：先用 dpkg 安装，再用 apt 修复
sudo dpkg -i some-package.deb
sudo apt-get install -f
```

---

## 5. 软件源配置

### 5.1 软件源文件位置

```bash
# 主要的软件源配置文件
/etc/apt/sources.list

# 软件源片段目录（推荐在此添加第三方源）
/etc/apt/sources.list.d/
# 每个第三方源一个文件，例如：
# docker.list
# nginx.list
# nodesource.list
```

### 5.2 sources.list 格式

```bash
# Debian 12 (Bookworm) 默认源
# 格式：deb/deb-src  URL  发行版代号  组件

# 官方源
deb http://deb.debian.org/debian bookworm main contrib non-free non-free-firmware
deb http://deb.debian.org/debian bookworm-updates main contrib non-free non-free-firmware
deb http://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware

# deb-src 表示源码包（通常不需要，可以注释掉）
# deb-src http://deb.debian.org/debian bookworm main contrib non-free non-free-firmware

# 组件说明：
# main        - 官方自由软件
# contrib     - 自由软件但依赖非自由软件
# non-free    - 非自由软件
# non-free-firmware - 非自由固件（Debian 12 新增）
```

### 5.3 国内镜像源配置（加速下载）

```bash
# 备份原有源
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

# 使用腾讯云镜像（国内推荐）
sudo tee /etc/apt/sources.list <<'EOF'
deb https://mirrors.tencent.com/debian/ bookworm main contrib non-free non-free-firmware
deb https://mirrors.tencent.com/debian/ bookworm-updates main contrib non-free non-free-firmware
deb https://mirrors.tencent.com/debian-security bookworm-security main contrib non-free non-free-firmware
EOF

# 或使用阿里云镜像
sudo tee /etc/apt/sources.list <<'EOF'
deb https://mirrors.aliyun.com/debian/ bookworm main contrib non-free non-free-firmware
deb https://mirrors.aliyun.com/debian/ bookworm-updates main contrib non-free non-free-firmware
deb https://mirrors.aliyun.com/debian-security bookworm-security main contrib non-free non-free-firmware
EOF

# 或使用中科大镜像
sudo tee /etc/apt/sources.list <<'EOF'
deb https://mirrors.ustc.edu.cn/debian/ bookworm main contrib non-free non-free-firmware
deb https://mirrors.ustc.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware
deb https://mirrors.ustc.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware
EOF

# 更新索引
sudo apt update
```

### 5.4 添加第三方软件源

```bash
# 以添加 Docker 官方源为例

# 1. 安装必要工具
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# 2. 创建密钥目录
sudo install -m 0755 -d /etc/apt/keyrings

# 3. 下载并添加 GPG 密钥
curl -fsSL https://download.docker.com/linux/debian/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 4. 添加软件源
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. 更新索引并安装
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### 5.5 使用新格式 DEB822 (.sources)

Debian 12 引入了新的 DEB822 格式（`.sources` 文件），比传统的 `sources.list` 更清晰：

```bash
# /etc/apt/sources.list.d/debian.sources
Types: deb
URIs: https://mirrors.tencent.com/debian
Suites: bookworm bookworm-updates
Components: main contrib non-free non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg

Types: deb
URIs: https://mirrors.tencent.com/debian-security
Suites: bookworm-security
Components: main contrib non-free non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg
```

---

## 6. 常见运维场景

### 场景 1：新服务器初始化

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装常用工具
sudo apt install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    tmux \
    tree \
    unzip \
    ca-certificates \
    gnupg \
    lsb-release

# 3. 清理
sudo apt autoremove -y && sudo apt autoclean
```

### 场景 2：查找并安装特定软件

```bash
# 搜索需要的软件
apt search "http server"

# 查看详细信息
apt show nginx

# 查看可用版本
apt-cache policy nginx

# 安装指定版本
sudo apt install nginx=1.26.0-1~bookworm

# 锁定版本（防止升级）
sudo apt-mark hold nginx

# 查看被锁定的包
apt-mark showhold

# 解除锁定
sudo apt-mark unhold nginx
```

### 场景 3：修复损坏的包

```bash
# 修复依赖问题
sudo apt-get install -f

# 重新配置已安装的包
sudo dpkg --configure -a

# 强制卸载有问题的包
sudo dpkg --remove --force-remove-reinstreq package-name

# 清理并重新安装
sudo apt-get remove --purge package-name
sudo apt-get autoremove
sudo apt-get clean
sudo apt update
sudo apt install package-name
```

### 场景 4：查看已安装包的信息

```bash
# 列出所有已安装的包
dpkg --get-selections

# 统计已安装包数量
dpkg --get-selections | wc -l

# 查看某个包安装了哪些文件
dpkg -L nginx | head -20

# 查看某个文件属于哪个包
dpkg -S /usr/sbin/nginx

# 查看最近安装的包（按时间排序）
grep " install " /var/log/dpkg.log | tail -20

# 查看包的变更日志
apt changelog nginx
```

### 场景 5：安全更新

```bash
# 只安装安全更新
sudo apt update

# 查看可更新的包
apt list --upgradable

# 安装 unattended-upgrades（自动安全更新）
sudo apt install unattended-upgrades

# 手动触发安全更新
sudo unattended-upgrade -v

# 配置自动安全更新
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 参考链接

- [Debian APT 手册](https://www.debian.org/doc/manuals/apt-howto/)
- [Debian 管理员手册](https://www.debian.org/doc/manuals/debian-handbook/)
- [apt 速查表](https://wangchujiang.com/reference/apt.html)
- [Debian 软件源列表](https://www.debian.org/mirror/list)
