import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService, categoryService } from '@/services';
import FeatureHeader from '@/components/organisms/FeatureHeader';
import TaskFilters from '@/components/organisms/TaskFilters';
import TaskList from '@/components/organisms/TaskList';
import AddTaskModal from '@/components/organisms/AddTaskModal';
import LoadingContent from '@/components/organisms/LoadingContent';
import ErrorContent from '@/components/organisms/ErrorContent';
import EmptyContent from '@/components/organisms/EmptyContent';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    status: 'active'
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      const newTask = await taskService.create({
        ...formData,
        dueDate: formData.dueDate || null
      });
      setTasks(prev => [newTask, ...prev]);
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        dueDate: ''
      });
      setShowAddForm(false);
      toast.success('Task created successfully!');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const toggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      });
      
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      
      if (!task.completed) {
        toast.success('Task completed! 🎉');
      } else {
        toast.success('Task reactivated');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
};

  const handleReorderTasks = async (taskIds) => {
    try {
      setLoading(true);
      await taskService.reorderTasks(taskIds);
      // Update local state to reflect new order
      const reorderedTasks = taskIds.map(id => tasks.find(t => t.id === id)).filter(Boolean);
      const remainingTasks = tasks.filter(t => !taskIds.includes(t.id));
      setTasks([...reorderedTasks, ...remainingTasks]);
      toast.success('Tasks reordered successfully!');
    } catch (err) {
      toast.error('Failed to reorder tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status === 'active' && task.completed) return false;
    if (filters.status === 'completed' && !task.completed) return false;
    if (filters.category !== 'all' && task.category !== filters.category) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    return true;
  });

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const progressPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  if (loading) {
    return <LoadingContent />;
  }

  if (error) {
    return <ErrorContent message={error} onRetry={loadData} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FeatureHeader
        title={filters.status === 'completed' ? 'Completed Tasks' : 'My Tasks'}
        activeTaskCount={activeTasks.length}
        progressPercentage={progressPercentage}
        onAddTask={() => setShowAddForm(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <TaskFilters
              filters={filters}
              categories={categories}
              onFilterChange={handleFilterChange}
              activeTaskCount={activeTasks.length}
              completedTaskCount={completedTasks.length}
              allTaskCount={tasks.length}
            />
          </div>
          <div className="lg:col-span-3">
            {filteredTasks.length === 0 ? (
              <EmptyContent 
                title={filters.status === 'completed' ? "No completed tasks yet" : "No tasks found"}
                description={filters.status === 'completed' ? "Complete some tasks to see them here" : "Create your first task to get started"}
                actionLabel="Add Task"
                onAction={() => setShowAddForm(true)}
              />
) : (
              <TaskList
                tasks={filteredTasks}
                categories={categories}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onReorderTasks={handleReorderTasks}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddTaskModal
          formData={formData}
          onFormChange={handleFormChange}
          categories={categories}
          onSubmit={handleSubmit}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default HomePage;