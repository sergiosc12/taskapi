// ============================================================
// app.js — Punto de entrada de la aplicación TaskAPI
// ============================================================
// Esta es la aplicación principal. Aquí configuramos Express,
// registramos middlewares y montamos las rutas del CRUD.
// ============================================================

const express = require('express');
const app = express();

// --- Middlewares globales ---
// express.json() permite que la app reciba JSON en el body de las peticiones
app.use(express.json());

// Middleware de seguridad básico: agrega cabeceras HTTP seguras
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Middleware de logging simple: registra cada petición
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// --- Rutas ---
const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

// Ruta raíz: health check (usada por Docker y CI/CD para verificar que el servicio está vivo)
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TaskAPI funcionando correctamente 🚀',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// --- Manejo de errores global ---
// Si una ruta lanza un error, este middleware lo captura y responde con 500
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
