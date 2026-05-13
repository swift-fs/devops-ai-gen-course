package main

import (
	"context"

	"github.com/gogf/gf/v2/errors/gerror"
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
	"github.com/gogf/gf/v2/os/gtime"
)

// IndexReq 首页请求
type IndexReq struct {
	g.Meta `path:"/" method:"get"`
}

// IndexRes 首页响应
type IndexRes struct {
	Service   string   `json:"service"`
	Version   string   `json:"version"`
	Endpoints []string `json:"endpoints"`
}

// HelloReq Hello 接口请求
type HelloReq struct {
	g.Meta `path:"/hello" method:"get"`
	Name   string `json:"name" d:"World" in:"query"`
}

// HelloRes Hello 接口响应
type HelloRes struct {
	Message string `json:"message"`
	Query   string `json:"query"`
}

// TimeReq 时间接口请求
type TimeReq struct {
	g.Meta `path:"/time" method:"get"`
}

// TimeRes 时间接口响应
type TimeRes struct {
	Time     string `json:"time"`
	Unix     int64  `json:"unix"`
	Timezone string `json:"timezone"`
}

// HealthReq 健康检查请求
type HealthReq struct {
	g.Meta `path:"/health" method:"get"`
}

// HealthRes 健康检查响应
type HealthRes struct {
	Status  string `json:"status"`
	Service string `json:"service"`
}

// Handler 路由处理器，使用 GoFrame 规范路由模式
type Handler struct{}

// Index 首页，返回服务基本信息
func (h *Handler) Index(ctx context.Context, req *IndexReq) (res *IndexRes, err error) {
	return &IndexRes{
		Service:   "Go API Service (GoFrame)",
		Version:   "1.0.0",
		Endpoints: []string{"/", "/hello", "/time", "/health"},
	}, nil
}

// Hello 返回问候信息
func (h *Handler) Hello(ctx context.Context, req *HelloReq) (res *HelloRes, err error) {
	if req.Name == "" {
		return nil, gerror.New("name 参数不能为空")
	}
	return &HelloRes{
		Message: "Hello, " + req.Name + "!",
		Query:   req.Name,
	}, nil
}

// Time 返回当前服务器时间
func (h *Handler) Time(ctx context.Context, req *TimeReq) (res *TimeRes, err error) {
	now := gtime.Now()
	return &TimeRes{
		Time:     now.Format("Y-m-d H:i:s"),
		Unix:     now.Timestamp(),
		Timezone: now.Location().String(),
	}, nil
}

// Health 健康检查接口
func (h *Handler) Health(ctx context.Context, req *HealthReq) (res *HealthRes, err error) {
	return &HealthRes{
		Status:  "ok",
		Service: "go-app",
	}, nil
}

func main() {
	s := g.Server()

	// 使用 Group 进行路由分组，绑定规范路由处理器
	s.Group("/", func(group *ghttp.RouterGroup) {
		group.Middleware(ghttp.MiddlewareHandlerResponse)
		group.Bind(
			&Handler{},
		)
	})

	s.SetPort(8000)
	s.Run()
}
