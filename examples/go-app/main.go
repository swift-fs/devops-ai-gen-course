package main

import (
	"context"
	"fmt"
	"time"

	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/net/ghttp"
)

// 确保 context.Context 接口存在（GoFrame 依赖）
var _ context.Context

func main() {
	s := g.Server()

	// 首页
	s.BindHandler("/", func(r *ghttp.Request) {
		r.Response.WriteJson(g.Map{
			"service":   "Go API Service (GoFrame)",
			"version":   "1.0.0",
			"endpoints": []string{"/", "/hello", "/time", "/health"},
		})
	})

	// Hello 接口
	s.BindHandler("/hello", func(r *ghttp.Request) {
		name := r.Get("name", "World").String()
		r.Response.WriteJson(g.Map{
			"message": fmt.Sprintf("Hello, %s!", name),
			"query":   name,
		})
	})

	// 时间接口
	s.BindHandler("/time", func(r *ghttp.Request) {
		r.Response.WriteJson(g.Map{
			"time":     time.Now().Format(time.RFC3339),
			"unix":     time.Now().Unix(),
			"timezone": time.Now().Location().String(),
		})
	})

	// 健康检查
	s.BindHandler("/health", func(r *ghttp.Request) {
		r.Response.WriteJson(g.Map{
			"status":  "ok",
			"service": "go-app",
		})
	})

	s.SetPort(8000)
	s.Run()
}
