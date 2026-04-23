# ============================================================
# Dockerfile — Empaqueta la aplicación en un contenedor Docker
# ============================================================
# Un contenedor es como una "caja sellada" que incluye la app
# y TODO lo que necesita para correr (Node.js, dependencias, etc.)
# Garantiza: "si corre en mi máquina, corre en producción"
# ============================================================

# ── ETAPA 1: BASE ────────────────────────────────────────────
# Usamos la imagen oficial de Node.js versión 20 "alpine"
# Alpine es una distribución Linux minimalista (~5MB vs ~900MB)
# Menos tamaño = menos superficie de ataque (principio de mínimo privilegio)
FROM node:20-alpine AS base

# Definimos el directorio de trabajo dentro del contenedor
# Todos los comandos siguientes se ejecutan desde aquí
WORKDIR /app

# Copiamos SOLO los archivos de dependencias primero
# Docker cachea capas: si package.json no cambia, no reinstala dependencias
# Esto hace el build mucho más rápido en el CI/CD
COPY package*.json ./

# ── ETAPA 2: DEPENDENCIAS DE PRODUCCIÓN ─────────────────────
# --omit=dev instala SOLO las dependencias de producción
# No incluimos ESLint, Jest, etc. en la imagen final (más ligera y segura)
FROM base AS deps
RUN npm ci --omit=dev
# npm ci es más estricto que npm install: usa exactamente package-lock.json
# Esto garantiza reproducibilidad (mismas versiones siempre)

# ── ETAPA 3: IMAGEN FINAL DE PRODUCCIÓN ─────────────────────
FROM node:20-alpine AS production

# Metadata de la imagen (buena práctica para trazabilidad)
LABEL maintainer="tu-email@ejemplo.com"
LABEL description="TaskAPI - Demo DevOps/DevSecOps"
LABEL version="1.0.0"

# Buena práctica de seguridad: NO correr como root
# Creamos un usuario sin privilegios para la app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S taskapi -u 1001 -G nodejs

WORKDIR /app

# Copiamos las dependencias de producción desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiamos el código fuente de la aplicación
COPY src/ ./src/
COPY package.json ./

# Cambiamos la propiedad de los archivos al usuario no-root
RUN chown -R taskapi:nodejs /app

# Cambiamos al usuario sin privilegios (principio de mínimo privilegio)
USER taskapi

# Documentamos el puerto que expone la app (solo documentación, no abre el puerto)
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Health check: Docker verifica cada 30s que la app responde
# Si falla 3 veces seguidas, el contenedor se marca como "unhealthy"
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Comando para iniciar la aplicación
CMD ["node", "src/server.js"]
