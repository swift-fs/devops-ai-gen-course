<template>
  <div class="card">
    <h2>首页</h2>
    <ul>
      <li><strong>框架：</strong>Vue 3 + Vue Router</li>
      <li><strong>部署方式：</strong>Docker + Nginx 静态托管</li>
      <li><strong>网关路径：</strong><code>/vue-sub/</code></li>
      <li><strong>当前URL：</strong><code>{{ currentUrl }}</code></li>
    </ul>
    <p class="tip">
      💡 二级目录部署的关键：Nginx 网关通过 <code>proxy_pass</code>
      将 <code>/vue-sub/</code> 的请求转发到本容器，并去掉路径前缀。
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
