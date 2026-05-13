<template>
  <div class="card">
    <h2>首页</h2>
    <ul>
      <li><strong>框架：</strong>Vue 3 + Vue Router</li>
      <li><strong>部署方式：</strong>Docker + Nginx（alias 方式）</li>
      <li><strong>网关路径：</strong><code>/vue-alias/</code></li>
      <li><strong>转发方式：</strong>网关保留前缀 → 容器 Nginx alias 映射</li>
      <li><strong>当前URL：</strong><code>{{ currentUrl }}</code></li>
    </ul>
    <p class="tip">
      💡 与「去前缀」方式的区别：网关 <code>proxy_pass</code> 不带尾斜杠，保留
      <code>/vue-alias/</code> 前缀转发到前端容器。前端容器 Nginx 使用
      <code>alias</code> 指令将 <code>/vue-alias/</code> 映射到文件根目录，
      而不是用 <code>root</code> + <code>location /</code>。
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
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
.tip {
  margin-top: 16px;
  padding: 12px;
  background: #ecfdf5;
  border-left: 3px solid #42b883;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #065f46;
}
</style>
