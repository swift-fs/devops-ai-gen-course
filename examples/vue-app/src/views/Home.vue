<template>
  <div>
    <div class="card">
      <h2>部署信息</h2>
      <ul>
        <li><strong>框架：</strong>Vue 3 + Vue Router + Vite</li>
        <li><strong>部署方式：</strong>Docker + Nginx 静态托管</li>
        <li><strong>访问路径：</strong><code>/vue/</code>（二级目录）</li>
        <li><strong>当前URL：</strong><code>{{ currentUrl }}</code></li>
      </ul>
    </div>
    <div class="card">
      <h2>路由测试</h2>
      <p>当前计数：<strong>{{ count }}</strong></p>
      <button class="btn" @click="count++">点击 +1</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const currentUrl = computed(() => window.location.href)
</script>

<style scoped>
.card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
}
.card h2 {
  font-size: 1.2rem;
  margin-bottom: 16px;
  color: #334155;
}
.card ul {
  list-style: none;
  padding: 0;
}
.card li {
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}
.card li:last-child {
  border-bottom: none;
}
code {
  background: #e0e7ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #4338ca;
}
.btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn:hover {
  background: #38a373;
}
</style>
