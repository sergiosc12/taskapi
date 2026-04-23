const express = require('express');
const app = express();

// Middlewares
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Rutas
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TaskAPI funcionando correctamente 🚀',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'taskapi',
  });
});

// Manejo de errores
app.use((err, req, res) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;