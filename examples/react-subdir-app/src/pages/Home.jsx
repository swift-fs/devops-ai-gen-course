export default function Home() {
  return (
    <div style={styles.card}>
      <h2>首页</h2>
      <ul style={styles.list}>
        <li><strong>框架：</strong>React 19 + React Router</li>
        <li><strong>部署方式：</strong>Docker + Nginx 静态托管</li>
        <li><strong>网关路径：</strong><code style={styles.code}>/react-sub/</code></li>
        <li><strong>当前URL：</strong><code style={styles.code}>{window.location.href}</code></li>
      </ul>
      <div style={styles.tip}>
        💡 二级目录部署：Nginx 网关通过 <code>proxy_pass</code> 将
        <code>/react-sub/</code> 请求转发到本容器，并去掉路径前缀。
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
