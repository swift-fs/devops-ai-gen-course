export default function Home() {
  return (
    <div style={styles.card}>
      <h2>首页</h2>
      <ul style={styles.list}>
        <li><strong>框架：</strong>React 19 + React Router</li>
        <li><strong>部署方式：</strong>Docker + Nginx（alias 方式）</li>
        <li><strong>网关路径：</strong><code style={styles.code}>/react-alias/</code></li>
        <li><strong>转发方式：</strong>网关保留前缀 → 容器 Nginx alias 映射</li>
        <li><strong>当前URL：</strong><code style={styles.code}>{window.location.href}</code></li>
      </ul>
      <div style={styles.tip}>
        💡 与「去前缀」方式的区别：网关 <code>proxy_pass</code> 不带尾斜杠，保留
        <code>/react-alias/</code> 前缀转发到前端容器。前端容器 Nginx 使用
        <code>alias</code> 指令将 <code>/react-alias/</code> 映射到文件根目录，
        而不是用 <code>root</code> + <code>location /</code>。
      </div>
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
  list: {
    listStyle: 'none',
    padding: 0,
  },
  code: {
    background: '#e0e7ff',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.9rem',
    color: '#4338ca',
  },
  tip: {
    marginTop: '16px',
    padding: '12px',
    background: '#ecfdf5',
    borderLeft: '3px solid #61dafb',
    borderRadius: '4px',
    fontSize: '0.9rem',
    color: '#065f46',
  },
}
