import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Home from "./views/Home.vue";
import About from "./views/About.vue";

// 二级目录部署（保留前缀方式）：
//   Router 的 base 路径与 Vite base 保持一致
//   网关保留 /vue-alias/ 前缀转发，浏览器 URL 中始终包含 /vue-alias/
//   Router 自动从 URL 中去掉 base 前缀后做路由匹配
const router = createRouter({
  history: createWebHistory("/vue-alias/"),
  routes: [
    { path: "/", component: Home },
    { path: "/about", component: About },
  ],
});

createApp(App).use(router).mount("#app");
