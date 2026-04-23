# 🚀 TaskAPI — Demo DevOps & DevSecOps

> **Proyecto académico** que demuestra la implementación de un pipeline CI/CD completo con prácticas de DevSecOps usando una API REST en Node.js.

[![CI/CD Pipeline](https://github.com/TU_USUARIO/taskapi/actions/workflows/ci.yml/badge.svg)](https://github.com/TU_USUARIO/taskapi/actions)
[![Node.js Version](https://img.shields.io/badge/node-20-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Tabla de Contenidos

1. [¿Qué es este proyecto?](#qué-es-este-proyecto)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Cómo ejecutarlo localmente](#cómo-ejecutarlo-localmente)
4. [Endpoints de la API](#endpoints-de-la-api)
5. [Pipeline CI/CD explicado](#pipeline-cicd-explicado)
6. [DevSecOps: Seguridad en el pipeline](#devsecops-seguridad-en-el-pipeline)
7. [Docker](#docker)
8. [Gestión de secretos](#gestión-de-secretos)
9. [Buenas prácticas implementadas](#buenas-prácticas-implementadas)

---

## ¿Qué es este proyecto?

**TaskAPI** es una API REST para gestión de tareas (CRUD completo) construida con Node.js/Express. Su propósito principal es servir como demostración de:

- **DevOps**: Automatización del ciclo de vida del software
- **DevSecOps**: Integración de seguridad en cada etapa del pipeline
- **CI/CD**: Integración y entrega continua con GitHub Actions
- **Containerización**: Empaquetado con Docker

---

## Estructura del proyecto

```
taskapi/
├── src/
│   ├── app.js                 # Configuración de Express
│   ├── server.js              # Punto de entrada del servidor
│   ├── routes/
│   │   └── tasks.js           # Definición de rutas
│   ├── controllers/
│   │   └── taskController.js  # Lógica de negocio
│   └── models/
│       └── taskModel.js       # Capa de datos
├── tests/
│   └── tasks.test.js          # Tests de integración
├── .github/
│   └── workflows/
│       └── ci.yml             # Pipeline CI/CD (GitHub Actions)
├── Dockerfile                 # Configuración del contenedor
├── .dockerignore
├── .eslintrc.js               # Configuración de ESLint (SAST)
├── .env.example               # Plantilla de variables de entorno
├── .gitignore
└── package.json
```

---

## Cómo ejecutarlo localmente

### Opción 1: Node.js directo

**Requisitos:** Node.js 18+ instalado

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/taskapi.git
cd taskapi

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Iniciar la aplicación
npm start

# La API estará disponible en: http://localhost:3000
```

### Opción 2: Docker

```bash
# Construir la imagen
docker build -t taskapi .

# Ejecutar el contenedor
docker run -p 3000:3000 taskapi

# La API estará disponible en: http://localhost:3000
```

### Ejecutar tests

```bash
npm test                    # Ejecuta tests + reporte de cobertura
npm run lint               # Análisis estático (ESLint)
npm audit                  # Auditoría de seguridad de dependencias
```

---

## Endpoints de la API

Base URL: `http://localhost:3000/api`

| Método | Ruta            | Descripción                    |
|--------|-----------------|--------------------------------|
| GET    | `/`             | Health check del servidor      |
| GET    | `/api/tasks`    | Listar todas las tareas        |
| GET    | `/api/tasks/:id`| Obtener una tarea por ID       |
| POST   | `/api/tasks`    | Crear nueva tarea              |
| PUT    | `/api/tasks/:id`| Actualizar tarea existente     |
| DELETE | `/api/tasks/:id`| Eliminar tarea                 |

### Ejemplos con curl

```bash
# Listar todas las tareas
curl http://localhost:3000/api/tasks

# Crear una tarea
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Aprender DevOps"}'

# Actualizar una tarea (marcar como completada)
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"done": true}'

# Eliminar una tarea
curl -X DELETE http://localhost:3000/api/tasks/1
```

---

## Pipeline CI/CD explicado

### ¿Qué pasa cuando hago un commit?

```
DESARROLLADOR
     │
     │ git push origin main
     ▼
┌─────────────────────────────────────────────────────┐
│              GITHUB ACTIONS (CI/CD)                 │
│                                                     │
│  JOB 1: Instalación y Build                         │
│  ├── Descarga el código                             │
│  ├── Instala Node.js 20                             │
│  ├── npm ci (instala dependencias)                  │
│  └── Verifica que la app carga                      │
│                    │                                │
│  ┌─────────────────┼─────────────────┐              │
│  ▼                 ▼                 ▼              │
│  JOB 2:          JOB 3:           JOB 4:            │
│  Calidad         Tests             Seguridad         │
│  (SAST)          (Jest)            (SCA)             │
│  ESLint          Cobertura         npm audit         │
│  Secretos        >70%              CVE check         │
│  │                 │                 │              │
│  └─────────────────┴─────────────────┘              │
│                    │                                │
│  JOB 5: Docker Build (solo en main)                 │
│  ├── Construye imagen                               │
│  ├── Escanea con Trivy                              │
│  └── Smoke test del contenedor                      │
│                    │                                │
│  JOB 6: Resumen y notificación                      │
└─────────────────────────────────────────────────────┘
     │
     ▼ (si todo pasó)
  ARTEFACTOS LISTOS PARA DEPLOY
```

---

## DevSecOps: Seguridad en el pipeline

### SAST (Static Application Security Testing)
**Qué es:** Analiza el código fuente SIN ejecutarlo, buscando vulnerabilidades.
**Herramienta:** ESLint con reglas de seguridad
**Detecta:** `eval()`, secretos hardcodeados, comparaciones débiles

### SCA (Software Composition Analysis)
**Qué es:** Analiza las librerías de terceros buscando CVEs conocidos.
**Herramienta:** `npm audit`
**Detecta:** Dependencias con vulnerabilidades reportadas públicamente

### DAST (Dynamic Application Security Testing)
**Qué es:** Prueba la aplicación mientras está ejecutándose.
**Herramienta:** OWASP ZAP (en entorno de staging)
**Detecta:** SQL Injection, XSS, problemas de autenticación en tiempo real
> ⚠️ En este demo, el smoke test del contenedor es un DAST básico.

### Escaneo de contenedores
**Herramienta:** Trivy (Aqua Security)
**Detecta:** Vulnerabilidades en las capas del sistema operativo base y paquetes

---

## Docker

### ¿Por qué Docker?
Docker garantiza que la aplicación funciona igual en cualquier entorno: el laptop del desarrollador, el servidor de CI y producción.

### Buenas prácticas implementadas en el Dockerfile:
- **Multi-stage build**: Imagen de producción más pequeña y segura
- **Usuario no-root**: La app corre como usuario sin privilegios
- **Alpine base**: Sistema operativo mínimo (~5MB vs ~900MB)
- **Health check**: Docker verifica periódicamente que la app responde
- **Dependencias de producción únicamente**: Sin herramientas de desarrollo

---

## Gestión de secretos

### ¿Cómo funcionan los GitHub Secrets?

Los secretos **nunca se escriben en el código**. Se configuran en GitHub y el pipeline los inyecta como variables de entorno durante la ejecución.

```
GitHub Repository
└── Settings
    └── Secrets and variables
        └── Actions
            ├── DOCKER_USERNAME     ← Usuario de Docker Hub
            ├── DOCKER_PASSWORD     ← Token de acceso
            └── SONAR_TOKEN         ← Token de análisis de código
```

En el pipeline se usan así:
```yaml
- name: Login a Docker Hub
  run: docker login -u ${{ secrets.DOCKER_USERNAME }} -p ${{ secrets.DOCKER_PASSWORD }}
```

**Principios:**
- Los secretos no aparecen en los logs (GitHub los enmascara)
- Solo los workflows autorizados pueden acceder a ellos
- Se rotan periódicamente (buena práctica)

---

## Buenas prácticas implementadas

| Práctica | Implementación |
|----------|----------------|
| Separación de responsabilidades | MVC: Model, Controller, Routes separados |
| Variables de entorno | `process.env.PORT` en vez de valores hardcodeados |
| Usuario no privilegiado en Docker | `USER taskapi` en Dockerfile |
| Tests aislados | `TaskModel._reset()` entre cada test |
| Cabeceras de seguridad HTTP | `X-Content-Type-Options`, `X-Frame-Options` |
| Dependencias pinneadas | `package-lock.json` + `npm ci` |
| Separación app/server | `app.js` importable en tests sin iniciar servidor |
| Validación de inputs | Sanitización y validación en el controlador |

---

## Ejemplo de error detectado por el pipeline

Si un desarrollador agrega código con `eval()`:

```javascript
// ❌ Código inseguro que el pipeline detecta
const result = eval(userInput);  // Riesgo de code injection
```

ESLint detecta esto y **el pipeline falla en el JOB 2** con:
```
error  'eval' can be harmful  no-eval
✖ 1 problem (1 error, 0 warnings)
```

El código **nunca llega a producción**. Esto es el valor del pipeline.

---

*Proyecto creado para exposición académica de DevOps & DevSecOps*
