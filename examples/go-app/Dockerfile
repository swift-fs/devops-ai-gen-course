# ===== 阶段一：构建 =====
FROM golang:1.23-alpine AS builder

WORKDIR /app

# 先复制依赖文件
COPY go.mod ./
COPY go.sum* ./

# 复制源码
COPY . .

# 整理依赖并构建
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/server .

# ===== 阶段二：运行 =====
FROM alpine:3.20

LABEL maintainer="devops-course"
LABEL description="Go API 服务 (GoFrame)"

# 安装 ca-certificates 用于 HTTPS 请求
RUN apk --no-cache add ca-certificates tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone

WORKDIR /app

# 创建非特权用户
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 从构建阶段复制二进制文件
COPY --from=builder /app/server .

# 修改文件所有者
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

CMD ["./server"]
