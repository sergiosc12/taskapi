const TaskModel = require('../models/taskModel');

const taskController = {
  getAll(req, res) {
    const tasks = TaskModel.findAll();
    res.json({ success: true, count: tasks.length, data: tasks });
  },

  getOne(req, res) {
    const task = TaskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }
    res.json({ success: true, data: task });
  },

  create(req, res) {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'El campo "title" es requerido y debe ser texto',
      });
    }

    const task = TaskModel.create({ title: title.trim() });
    res.status(201).json({ success: true, data: task });
  },

  update(req, res) {
    const { title, done } = req.body;

    if (title === undefined && done === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Debes enviar al menos "title" o "done"',
      });
    }

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

  delete(req, res) {
    const deleted = TaskModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Tarea no encontrada' });
    }
    res.json({ success: true, message: 'Tarea eliminada correctamente' });
  },
};

module.exports = taskController;
