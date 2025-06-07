import categoriesData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.data = [...categoriesData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const item = this.data.find(category => category.id === id);
    if (!item) {
      throw new Error('Category not found');
    }
    return { ...item };
  }

  async create(categoryData) {
    await delay(300);
    const newCategory = {
      id: Date.now().toString(),
      name: categoryData.name,
      color: categoryData.color,
      icon: categoryData.icon || 'Folder'
    };
    this.data.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(category => category.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(category => category.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    this.data.splice(index, 1);
    return true;
  }
}

export default new CategoryService();