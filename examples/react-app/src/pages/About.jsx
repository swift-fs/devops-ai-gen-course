import React from "react";

export default function About() {
  return (
    <div style={styles.card}>
      <h2>关于页面</h2>
      <p style={styles.paragraph}>这是 React 单页应用的「关于」页面。</p>
      <p style={styles.paragraph}>
        通过 <code style={styles.code}>react-router-dom</code> 的{" "}
        <code style={styles.code}>BrowserRouter</code> 实现前端路由。
      </p>
      <p style={styles.paragraph}>
        Nginx 配置中使用 <code style={styles.code}>try_files</code> 回退到{" "}
        <code style={styles.code}>index.html</code>，确保 SPA 路由正常。
      </p>
    </div>
  );
}

const styles = {
  card: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
  },
  paragraph: {
    marginBottom: "12px",
    lineHeight: "1.6",
  },
  code: {
    background: "#e0e7ff",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.9rem",
    color: "#4338ca",
  },
};
