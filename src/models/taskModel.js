// ============================================================
// models/taskModel.js — Capa de datos (modelo)
// ============================================================
// En un proyecto real, aquí conectaríamos a una base de datos
// (MongoDB, PostgreSQL, etc.). Para este ejemplo académico,
// usamos un array en memoria para mantener todo simple y
// sin dependencias externas.
//
// Patrón: Repository / Data Access Layer
// ============================================================

// "Base de datos" en memoria — se reinicia cuando el proceso se detiene
let tasks = [
  { id: 1, title: 'Configurar pipeline CI/CD', done: false, createdAt: new Date().toISOString() },
  { id: 2, title: 'Escribir tests unitarios', done: false, createdAt: new Date().toISOString() },
  { id: 3, title: 'Revisar análisis SAST', done: true,  createdAt: new Date().toISOString() },
];

// Contador para asignar IDs únicos (en una BD real, esto lo hace AUTO_INCREMENT o UUID)
let nextId = 4;

const TaskModel = {
  // Devuelve todas las tareas
  findAll() {
    return [...tasks]; // Retornamos una copia para evitar mutaciones externas
  },

  // Busca una tarea por su ID; retorna undefined si no existe
  findById(id) {
    return tasks.find((t) => t.id === Number(id));
  },

  // Crea una nueva tarea y la agrega al array
  create({ title }) {
    const newTask = {
      id: nextId++,
      title,
      done: false,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return newTask;
  },

  // Actualiza una tarea existente; retorna null si no la encuentra
  update(id, { title, done }) {
    const index = tasks.findIndex((t) => t.id === Number(id));
    if (index === -1) {return null;}

    // Solo actualizamos los campos que vengan en el body
    if (title !== undefined) {tasks[index].title = title;}
    if (done !== undefined) {tasks[index].done = done;}
    tasks[index].updatedAt = new Date().toISOString();

    return tasks[index];
  },

  // Elimina una tarea; retorna true si se eliminó, false si no existía
  delete(id) {
    const index = tasks.findIndex((t) => t.id === Number(id));
    if (index === -1) {return false;}
    tasks.splice(index, 1);
    return true;
  },

  // Método utilitario para tests: reinicia el estado
  _reset() {
    tasks = [];
    nextId = 1;
  },
};

module.exports = TaskModel;
