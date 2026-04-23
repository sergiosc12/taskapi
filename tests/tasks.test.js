// ============================================================
// tests/tasks.test.js — Tests de integración de la API
// ============================================================
// Usamos Jest (framework de testing) + Supertest (para HTTP).
// Los tests verifican que cada endpoint funciona correctamente.
//
// IMPORTANCIA EN DEVSECOPS:
// Los tests son la primera línea de defensa. Si un cambio
// rompe funcionalidad existente, el pipeline falla ANTES
// de llegar a producción.
// ============================================================

const request = require('supertest');
const app = require('../src/app');
const TaskModel = require('../src/models/taskModel');

// Antes de cada test, limpiamos el estado para aislamiento
beforeEach(() => {
  TaskModel._reset();
});

// ─── SUITE: GET /api/tasks ───────────────────────────────────
describe('GET /api/tasks', () => {
  test('Debe retornar lista vacía cuando no hay tareas', async () => {
    const res = await request(app).get('/api/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
    expect(res.body.count).toBe(0);
  });

  test('Debe retornar las tareas existentes', async () => {
    // Crear datos de prueba
    TaskModel.create({ title: 'Tarea de prueba' });
    TaskModel.create({ title: 'Otra tarea' });

    const res = await request(app).get('/api/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBe(2);
    expect(res.body.data).toHaveLength(2);
  });
});

// ─── SUITE: GET /api/tasks/:id ──────────────────────────────
describe('GET /api/tasks/:id', () => {
  test('Debe retornar una tarea por ID', async () => {
    const created = TaskModel.create({ title: 'Tarea específica' });

    const res = await request(app).get(`/api/tasks/${created.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Tarea específica');
  });

  test('Debe retornar 404 si la tarea no existe', async () => {
    const res = await request(app).get('/api/tasks/9999');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ─── SUITE: POST /api/tasks ──────────────────────────────────
describe('POST /api/tasks', () => {
  test('Debe crear una nueva tarea correctamente', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Nueva tarea' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Nueva tarea');
    expect(res.body.data.done).toBe(false);
    expect(res.body.data.id).toBeDefined();
  });

  test('Debe rechazar tarea sin title (validación)', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('title');
  });

  test('Debe rechazar title vacío', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: '   ' });

    expect(res.statusCode).toBe(400);
  });
});

// ─── SUITE: PUT /api/tasks/:id ───────────────────────────────
describe('PUT /api/tasks/:id', () => {
  test('Debe actualizar el título de una tarea', async () => {
    const created = TaskModel.create({ title: 'Original' });

    const res = await request(app)
      .put(`/api/tasks/${created.id}`)
      .send({ title: 'Modificada' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Modificada');
  });

  test('Debe marcar tarea como completada', async () => {
    const created = TaskModel.create({ title: 'Pendiente' });

    const res = await request(app)
      .put(`/api/tasks/${created.id}`)
      .send({ done: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.done).toBe(true);
  });

  test('Debe retornar 404 si la tarea no existe', async () => {
    const res = await request(app)
      .put('/api/tasks/9999')
      .send({ title: 'No importa' });

    expect(res.statusCode).toBe(404);
  });

  test('Debe rechazar body sin campos válidos', async () => {
    const created = TaskModel.create({ title: 'Test' });

    const res = await request(app)
      .put(`/api/tasks/${created.id}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });
});

// ─── SUITE: DELETE /api/tasks/:id ────────────────────────────
describe('DELETE /api/tasks/:id', () => {
  test('Debe eliminar una tarea existente', async () => {
    const created = TaskModel.create({ title: 'Para eliminar' });

    const res = await request(app).delete(`/api/tasks/${created.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Verificar que ya no existe
    const check = await request(app).get(`/api/tasks/${created.id}`);
    expect(check.statusCode).toBe(404);
  });

  test('Debe retornar 404 si la tarea no existe', async () => {
    const res = await request(app).delete('/api/tasks/9999');
    expect(res.statusCode).toBe(404);
  });
});

// ─── SUITE: Health Check ─────────────────────────────────────
describe('GET /', () => {
  test('Health check debe retornar status ok', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
