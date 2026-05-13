import express from 'express'

const app = express()
const PORT = 3000

// 首页
app.get('/', (req, res) => {
  res.json({
    service: 'Node.js API Service (Express)',
    version: '1.0.0',
    endpoints: ['/', '/hello', '/time', '/health'],
  })
})

// Hello 接口
app.get('/hello', (req, res) => {
  const name = req.query.name || 'World'
  res.json({
    message: `Hello, ${name}!`,
    query: name,
  })
})

// 时间接口
app.get('/time', (req, res) => {
  res.json({
    time: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })
})

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'node-app' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Node.js 服务启动成功，监听端口 ${PORT}`)
})
