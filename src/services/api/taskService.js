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

  async reorderTasks(taskIds) {
    await delay(300);
    try {
      // Create a new array to maintain order
      const reorderedTasks = [];
      
      // First, add tasks in the new order
      taskIds.forEach(id => {
        const task = this.data.find(t => t.id === id);
        if (task) reorderedTasks.push(task);
      });
      
      // Add any tasks not in the reorder list (shouldn't happen in normal usage)
      this.data.forEach(task => {
        if (!taskIds.includes(task.id)) {
          reorderedTasks.push(task);
        }
      });
      
      this.data = reorderedTasks;
      return [...this.data];
    } catch (error) {
      throw new Error('Failed to reorder tasks');
    }
  }
}

export default new TaskService();