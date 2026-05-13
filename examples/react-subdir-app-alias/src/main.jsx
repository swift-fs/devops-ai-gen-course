import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

function Nav() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>
        首页
      </Link>
      <Link to="/about" style={styles.link}>
        关于
      </Link>
    </nav>
  );
}

function App() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🔵 React 二级目录部署（alias 方式）</h1>
        <p style={styles.subtitle}>
          网关保留 <code style={styles.code}>/react-alias/</code> 前缀转发，容器
          Nginx 用 <code style={styles.code}>alias</code> 映射
        </p>
        <Nav />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "640px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#1a1a2e",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "0.95rem",
    marginBottom: "16px",
  },
  code: {
    background: "#e0e7ff",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.9rem",
    color: "#4338ca",
  },
  nav: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    marginTop: "16px",
  },
  link: {
    padding: "8px 20px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#61dafb",
    border: "1px solid #61dafb",
    transition: "all 0.2s",
  },
};

// basename 与 Vite base 保持一致，确保前端路由正确匹配
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/react-alias">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
