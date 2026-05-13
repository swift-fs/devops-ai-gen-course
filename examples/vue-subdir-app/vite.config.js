import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// 子路径部署：base 设为 /vue-sub/，构建产物中的资源引用会带上前缀
// 网关 proxy_pass 末尾带 / 会去掉 /vue-sub/ 前缀后转发
export default defineConfig({
  plugins: [vue()],
  base: "/vue-sub/",
});
