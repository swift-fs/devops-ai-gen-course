export default function Home() {
  const [count, setCount] = React.useState(0);

  return (
    <>
      <div style={styles.card}>
        <h2>部署信息</h2>
        <ul style={styles.list}>
          <li>
            <strong>框架：</strong>React 19 + React Router + Vite
          </li>
          <li>
            <strong>部署方式：</strong>Docker + Nginx 静态托管
          </li>
          <li>
            <strong>网关路径：</strong>
            <code>/react/</code>
          </li>
          <li>
            <strong>当前URL：</strong>
            <code>{window.location.href}</code>
          </li>
        </ul>
      </div>
      <div style={styles.card}>
        <h2>交互测试</h2>
        <p>
          当前计数：<strong>{count}</strong>
        </p>
        <button style={styles.button} onClick={() => setCount((c) => c + 1)}>
          点击 +1
        </button>
      </div>
    </>
  );
}

import React from "react";

const styles = {
  card: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  button: {
    background: "#61dafb",
    color: "#20232a",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  },
};
