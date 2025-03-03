import express from 'express';

const app = express();
const PORT = 8965;

// 允许 Electron 访问此服务器
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 提供静态文件
app.use(express.static('public'));

// 示例 API 路由
app.post('/api/chat', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
