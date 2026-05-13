<template>
  <div class="app">
    <header class="header">
      <h1>🟢 Vue 单页应用</h1>
      <p class="subtitle">二级目录部署示例 — 通过 Nginx 网关 <code>/vue/</code> 路径访问</p>
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
      </nav>
    </header>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.app {
  max-width: 640px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1a1a2e;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.subtitle {
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.subtitle code {
  background: #e0e7ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #4338ca;
}

.nav {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 16px;
}

.nav-link {
  padding: 8px 20px;
  border-radius: 8px;
  text-decoration: none;
  color: #42b883;
  border: 1px solid #42b883;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #42b883;
  color: white;
}
</style>
