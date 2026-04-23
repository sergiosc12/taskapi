// ============================================================
// server.js — Arranca el servidor HTTP
// ============================================================
// Separamos app.js de server.js para poder importar la app
// en los tests sin que el servidor se inicie automáticamente.
// Esta es una buena práctica de arquitectura en Node.js.
// ============================================================

const app = require('./app');

// El puerto se lee desde variables de entorno (buena práctica DevOps)
// Si no existe la variable, usa 3000 como fallback
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado en http://localhost:${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Versión: ${process.env.APP_VERSION || '1.0.0'}`);
});
