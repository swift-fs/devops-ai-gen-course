import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 子路径部署：base 设为 /react-sub/，构建产物中的资源引用会带上前缀
// 网关 proxy_pass 末尾带 / 会去掉 /react-sub/ 前缀后转发
export default defineConfig({
  plugins: [react()],
  base: "/react-sub/",
});
