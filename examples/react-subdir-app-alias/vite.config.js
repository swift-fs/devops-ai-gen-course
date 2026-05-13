import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 二级目录部署（保留前缀转发方式）：
//   base 设为 /react-alias/，构建产物中的资源引用会带上 /react-alias/ 前缀
//   网关 proxy_pass 不带尾斜杠，保留 /react-alias/ 前缀转发到前端容器
//   前端容器 Nginx 用 alias 将 /react-alias/ 映射到文件根目录
export default defineConfig({
  plugins: [react()],
  base: "/react-alias/",
});
