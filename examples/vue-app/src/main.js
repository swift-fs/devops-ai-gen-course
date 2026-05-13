import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import About from './views/About.vue'

// 二级目录部署：history 基础路径与 Vite base 一致
const router = createRouter({
  history: createWebHistory('/vue/'),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
  ],
})

createApp(App).use(router).mount('#app')
