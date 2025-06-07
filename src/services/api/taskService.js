import tasksData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.data = [...tasksData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(task => task.id === id);
    if (!item) {
      throw new Error('Task not found');
    }
    return { ...item };
  }

  async create(taskData) {
    await delay(400);
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category || '',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    this.data.unshift(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    this.data.splice(index, 1);
    return true;
  }
}

export default new TaskService();