export default function About() {
  return (
    <div style={styles.card}>
      <h2>关于页面</h2>
      <p>这是 React 二级目录部署（alias 方式）的「关于」页面。</p>
      <p>
        通过 <code style={styles.code}>react-router-dom</code> 的
        <code style={styles.code}>BrowserRouter</code> 实现前端路由。
      </p>
      <p>
        前端容器 Nginx 使用 <code style={styles.code}>alias</code> 指令处理带前缀的请求路径，
        <code style={styles.code}>try_files</code> 回退到
        <code style={styles.code}>/react-alias/index.html</code>，确保 SPA 路由正常。
      </p>
    </div>
  )
}

const styles = {
  card: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
  },
  code: {
    background: '#e0e7ff',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    color: '#4338ca',
  },
}
