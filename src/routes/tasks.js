// ============================================================
// routes/tasks.js — Definición de rutas del recurso "tasks"
// ============================================================
// El Router de Express agrupa las rutas relacionadas.
// Aquí definimos los 4 endpoints del CRUD.
// ============================================================

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET    /api/tasks        → listar todas
// POST   /api/tasks        → crear nueva
// GET    /api/tasks/:id    → obtener una
// PUT    /api/tasks/:id    → actualizar
// DELETE /api/tasks/:id    → eliminar

router.get('/',     taskController.getAll);
router.post('/',    taskController.create);
router.get('/:id',  taskController.getOne);
router.put('/:id',  taskController.update);
router.delete('/:id', taskController.delete);

module.exports = router;
