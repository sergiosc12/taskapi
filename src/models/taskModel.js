let tasks = [
  { id: 1, title: 'Configurar pipeline CI/CD', done: false, createdAt: new Date().toISOString() },
  { id: 2, title: 'Escribir tests unitarios', done: false, createdAt: new Date().toISOString() },
  { id: 3, title: 'Revisar análisis SAST', done: true,  createdAt: new Date().toISOString() },
];

let nextId = 4;

const TaskModel = {
  findAll() {
    return [...tasks];
  },

  findById(id) {
    return tasks.find((t) => t.id === Number(id));
  },

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

  update(id, { title, done }) {
    const index = tasks.findIndex((t) => t.id === Number(id));
    if (index === -1) {return null;}

    if (title !== undefined) {tasks[index].title = title;}
    if (done !== undefined) {tasks[index].done = done;}
    tasks[index].updatedAt = new Date().toISOString();

    return tasks[index];
  },

  delete(id) {
    const index = tasks.findIndex((t) => t.id === Number(id));
    if (index === -1) {return false;}
    tasks.splice(index, 1);
    return true;
  },

  _reset() {
    tasks = [];
    nextId = 1;
  },
};

module.exports = TaskModel;
