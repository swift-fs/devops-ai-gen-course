<template>
  <div class="card">
    <h2>关于页面</h2>
    <p>这是 Vue 二级目录部署（alias 方式）的「关于」页面。</p>
    <p>
      通过 <code>vue-router</code> 的 <code>createWebHistory</code> 实现前端路由。
    </p>
    <p>
      前端容器 Nginx 使用 <code>alias</code> 指令处理带前缀的请求路径，
      <code>try_files</code> 回退到 <code>/vue-alias/index.html</code>，确保 SPA 路由正常工作。
    </p>
  </div>
</template>

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
code {
  background: #e0e7ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #4338ca;
}
</style>
