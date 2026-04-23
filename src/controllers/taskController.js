// ============================================================
// controllers/taskController.js — Lógica de negocio
// ============================================================
// El controlador recibe la petición HTTP, aplica validaciones
// y reglas de negocio, llama al modelo y devuelve la respuesta.
// Patrón MVC: Modelo → Vista → Controlador
// ============================================================

const TaskModel = require('../models/taskModel');

const taskController = {
  // GET /api/tasks — Lista todas las tareas
  getAll(req, res) {
    const tasks = TaskModel.findAll();
    res.json({ success: true, count: tasks.length, data: tasks });
  },

  // GET /api/tasks/:id — Obtiene una tarea por ID
  getOne(req, res) {
    const task = TaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }
    res.json({ success: true, data: task });
  },

  // POST /api/tasks — Crea una nueva tarea
  create(req, res) {
    const { title } = req.body;

    // Validación básica — en producción usaríamos Joi o express-validator
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'El campo "title" es requerido y debe ser texto',
      });
    }

    // Sanitización básica (seguridad: elimina espacios extra)
    const task = TaskModel.create({ title: title.trim() });
    res.status(201).json({ success: true, data: task });
  },

  // PUT /api/tasks/:id — Actualiza una tarea existente
  update(req, res) {
    const { title, done } = req.body;

    // Validación: al menos uno de los campos debe venir
    if (title === undefined && done === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Debes enviar al menos "title" o "done"',
      });
    }

    // Validación de tipo para "done"
    if (done !== undefined && typeof done !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'El campo "done" debe ser booleano (true/false)',
      });
    }

    const task = TaskModel.update(req.params.id, { title, done });
    if (!task) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }
    res.json({ success: true, data: task });
  },

  // DELETE /api/tasks/:id — Elimina una tarea
  delete(req, res) {
    const deleted = TaskModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }
    res.json({ success: true, message: 'Tarea eliminada correctamente' });
  },
};

module.exports = taskController;
