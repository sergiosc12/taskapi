# 🎤 GUIÓN DE EXPOSICIÓN — DevOps & DevSecOps con CI/CD
## TaskAPI: Un pipeline completo explicado paso a paso

---

## 📌 ESTRUCTURA SUGERIDA (20-30 minutos)

| Bloque | Tema | Tiempo |
|--------|------|--------|
| 1 | Introducción: El problema | 3 min |
| 2 | ¿Qué es DevOps? | 4 min |
| 3 | ¿Qué es DevSecOps? | 3 min |
| 4 | ¿Qué es CI/CD? | 3 min |
| 5 | Demo del proyecto | 8 min |
| 6 | Preguntas | 5 min |

---

## 🎯 BLOQUE 1: EL PROBLEMA (3 minutos)

> *"Imaginen este escenario..."*

"Un equipo de 5 desarrolladores trabaja en una aplicación. Cada quien tiene código diferente en su máquina. Cuando intentan unirlo todo, aparecen errores. Nadie sabe qué cambio rompió qué cosa. Para hacer un deploy, alguien tiene que conectarse manualmente al servidor, copiar archivos, rezar para que funcione."

"Además, en algún momento alguien subió una contraseña en el código sin querer. Un atacante la encontró en GitHub. La empresa tuvo una brecha de seguridad."

**"DevOps y DevSecOps existen para resolver exactamente estos problemas."**

---

## 🔷 BLOQUE 2: ¿QUÉ ES DEVOPS? (4 minutos)

### Definición simple:
> "DevOps es una cultura y conjunto de prácticas que une a los equipos de **Desarrollo** (Dev) y **Operaciones** (Ops) para entregar software más rápido y con más calidad."

### Antes de DevOps (el problema):
- Los desarrolladores escribían código → lo "tiraban por encima del muro" a operaciones
- Operaciones tenía que configurar servidores manualmente
- Nadie se comunicaba → errores, lentitud, culpas

### Con DevOps:
- **Automatización**: Las tareas repetitivas las hace una máquina
- **Colaboración**: Dev y Ops trabajan juntos desde el principio
- **Entrega continua**: En vez de desplegar una vez al mes, se despliega varias veces al día
- **Feedback rápido**: Si algo falla, se sabe en minutos, no semanas

### La analogía de la fábrica:
> "Imaginen una fábrica de automóviles. Antes, cada operario hacía todo el auto. Con la línea de ensamblaje (automatización), cada pieza pasa por estaciones especializadas. Es más rápido, más consistente y con menos errores. DevOps es la línea de ensamblaje del software."

---

## 🔐 BLOQUE 3: ¿QUÉ ES DEVSECOPS? (3 minutos)

### Definición simple:
> "DevSecOps agrega **Seguridad** (Sec) a DevOps. La seguridad ya no es algo que se revisa al final, sino que está integrada en cada paso del proceso."

### El problema con la seguridad tradicional:
- En el modelo antiguo: los auditores de seguridad revisaban el software **después** de que estaba terminado
- Encontraban problemas → había que reescribir semanas de trabajo
- Era caro, lento y frustrante

### Con DevSecOps:
- **"Shift left"**: Mover la seguridad hacia la izquierda (más temprano) en el proceso
- Si hay un problema de seguridad, se detecta en el commit, no en producción
- Cada desarrollador es responsable de la seguridad de su código

### Las tres capas de análisis de seguridad:

**SAST (Static Application Security Testing)**
- Analiza el código sin ejecutarlo
- Busca patrones peligrosos: eval(), secretos hardcodeados, inyecciones SQL
- Ejemplo: ESLint con reglas de seguridad

**SCA (Software Composition Analysis)**
- Analiza las librerías de terceros que usamos
- Las librerías también pueden tener vulnerabilidades (CVEs)
- Ejemplo: npm audit, Snyk, OWASP Dependency Check

**DAST (Dynamic Application Security Testing)**
- Prueba la aplicación mientras está corriendo
- Simula ataques reales: XSS, SQL Injection, autenticación débil
- Ejemplo: OWASP ZAP, Burp Suite

---

## ⚙️ BLOQUE 4: ¿QUÉ ES CI/CD? (3 minutos)

### CI — Integración Continua:
> "Cada vez que un desarrollador sube código, se ejecuta automáticamente una serie de verificaciones: ¿el código compila? ¿los tests pasan? ¿tiene vulnerabilidades?"

- **Continua** = sucede con cada cambio, no una vez al mes
- **Integración** = el código de todos se integra y se verifica constantemente
- Si algo falla → el desarrollador recibe notificación inmediata

### CD — Entrega/Despliegue Continuo:
> "Si la integración pasó todas las verificaciones, el código puede entregarse automáticamente al entorno de producción."

- **Delivery** (Entrega): El código está listo para deploy, pero alguien aprueba manualmente
- **Deployment** (Despliegue): El deploy también es automático

### ¿Qué es un Pipeline?
> "Un pipeline es la secuencia de pasos automatizados que el código debe superar para llegar a producción. Como un túnel de lavado de autos: el auto entra sucio y sale limpio habiendo pasado por múltiples etapas."

---

## 💻 BLOQUE 5: DEMO DEL PROYECTO (8 minutos)

### La aplicación (2 min)

"Construimos **TaskAPI**, una API REST de gestión de tareas. Tiene 5 endpoints básicos:"

```
GET    /api/tasks        → Listar tareas
POST   /api/tasks        → Crear tarea
GET    /api/tasks/:id    → Ver una tarea
PUT    /api/tasks/:id    → Actualizar tarea
DELETE /api/tasks/:id    → Eliminar tarea
```

"La arquitectura sigue el patrón MVC:
- **Model**: Los datos (taskModel.js)
- **Controller**: La lógica de negocio (taskController.js)
- **Routes**: Las URLs disponibles (tasks.js)"

---

### El pipeline paso a paso (5 min)

> *"Ahora vamos a ver qué pasa exactamente cuando hago un `git push`..."*

**PASO 1 — El trigger:**
```bash
git add .
git commit -m "feat: agregar endpoint de tareas"
git push origin main
```
*"Esto dispara automáticamente el pipeline en GitHub Actions."*

---

**PASO 2 — Job: Instalación y Build**
```yaml
- npm ci                    # Instala dependencias exactas
- node -e "require('./src/app')"  # Verifica que carga
```
*"¿Por qué `npm ci` en vez de `npm install`? Porque usa exactamente las versiones del package-lock.json. Reproducibilidad garantizada."*

---

**PASO 3 — Job: Calidad de Código (SAST básico)**
```yaml
- npm run lint     # ESLint revisa el código
```
*"ESLint analiza el código sin ejecutarlo. Si encuentra un `eval()` o una variable sin usar, falla aquí. El código no avanza."*

Mostrar ejemplo de error:
```javascript
// Esto causaría que el pipeline falle:
const result = eval(userInput);  // ← no-eval rule
```

---

**PASO 4 — Job: Tests**
```yaml
- npm run test:ci   # Jest ejecuta todos los tests
```
*"Tenemos 15 tests que verifican todos los endpoints. Jest también calcula la cobertura: qué porcentaje del código está cubierto por tests. Si baja del 70%, el pipeline falla."*

---

**PASO 5 — Job: Seguridad (SCA)**
```yaml
- npm audit --audit-level=high
```
*"npm audit compara nuestras dependencias contra una base de datos de vulnerabilidades conocidas (CVEs). Si encontramos una vulnerabilidad crítica, el pipeline se detiene."*

---

**PASO 6 — Job: Docker Build**
```yaml
- docker build ...
- trivy scan image
- docker run + curl (smoke test)
```
*"Solo si TODOS los jobs anteriores pasaron, construimos la imagen Docker. Luego Trivy la escanea buscando vulnerabilidades en el sistema operativo base y las librerías. Finalmente, un smoke test verifica que el contenedor arranca y responde."*

---

**PASO 7 — ¿Qué es Docker?**

"Docker es como una 'caja sellada' que contiene la aplicación y TODO lo que necesita para correr: Node.js, librerías, configuración. Esta caja funciona igual en cualquier lugar."

"Buenas prácticas en nuestro Dockerfile:
- Usuario no-root (principio de mínimo privilegio)
- Imagen Alpine (mínima superficie de ataque)
- Multi-stage build (imagen de producción más pequeña)"

---

### La gestión de secretos (1 min)

"Una pregunta crucial: ¿Cómo conectamos la imagen de Docker a Docker Hub sin poner la contraseña en el código?"

```yaml
# Mal (nunca hacer esto):
run: docker login -u miusuario -p MiContraseña123

# Bien (usando GitHub Secrets):
run: docker login -u ${{ secrets.DOCKER_USERNAME }} -p ${{ secrets.DOCKER_PASSWORD }}
```

"Los secretos se configuran en GitHub → Settings → Secrets. El pipeline los inyecta como variables de entorno. Nunca aparecen en los logs. Si alguien roba el repositorio, no obtiene las contraseñas."

---

## 💡 PUNTOS CLAVE PARA CERRAR

1. **DevOps no es una herramienta, es una cultura**: Colaboración + Automatización + Feedback rápido

2. **DevSecOps es "seguridad desde el primer día"**: No es una capa extra al final, es parte del proceso

3. **El pipeline como red de seguridad**: Antes de que el código llegue a producción, pasó por 6 verificaciones automáticas

4. **El valor real**: Un bug detectado en el commit cuesta $1. El mismo bug en producción puede costar $10,000

5. **Todo esto es gratuito**: GitHub Actions, npm audit, ESLint, Trivy — herramientas open-source de nivel enterprise

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Cuánto tiempo tarda el pipeline?**
R: Aproximadamente 3-5 minutos para este proyecto. En proyectos grandes puede ser 15-30 minutos.

**P: ¿Qué pasa si el pipeline falla?**
R: El desarrollador recibe una notificación. El código NO se integra a la rama principal. Se debe corregir y volver a hacer push.

**P: ¿Es obligatorio usar GitHub Actions?**
R: No. También existen GitLab CI, Jenkins, CircleCI, Azure DevOps. GitHub Actions es gratuito para proyectos públicos.

**P: ¿DAST no lo implementamos en el pipeline?**
R: El smoke test del contenedor es un DAST muy básico. Un DAST completo requeriría levantar toda la aplicación en un entorno de staging y ejecutar herramientas como OWASP ZAP contra ella, lo que agrega complejidad.

**P: ¿Cómo se conecta esto con Kubernetes o la nube?**
R: El siguiente paso sería agregar un job de "deploy" que, después del docker build, haga push de la imagen a un registry (Docker Hub, AWS ECR) y actualice el deployment en Kubernetes o ECS.

---

*"En resumen: DevOps y DevSecOps no son tecnologías que se 'instalan', son formas de trabajar que permiten a los equipos entregar software de calidad, con seguridad, de forma rápida y sostenible."*

---

*Guión preparado para exposición académica | Proyecto TaskAPI*
