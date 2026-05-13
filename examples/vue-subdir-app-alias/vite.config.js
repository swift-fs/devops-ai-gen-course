import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// 二级目录部署（保留前缀转发方式）：
//   base 设为 /vue-alias/，构建产物中的资源引用会带上 /vue-alias/ 前缀
//   网关 proxy_pass 不带尾斜杠，保留 /vue-alias/ 前缀转发到前端容器
//   前端容器 Nginx 用 alias 将 /vue-alias/ 映射到文件根目录
export default defineConfig({
  plugins: [vue()],
  base: "/vue-alias/",
});
