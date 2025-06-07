import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, isToday, isPast, parseISO } from 'date-fns';
import ApperIcon from './ApperIcon';
import { taskService, categoryService } from '../services';

function MainFeature() {
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

  // Form state
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
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
                {filters.status === 'completed' ? 'Completed Tasks' : 'My Tasks'}
              </h1>
              <p className="mt-1 text-surface-600">
                {activeTasks.length} active tasks • {progressPercentage}% complete
              </p>
            </div>
            
            {/* Progress Ring */}
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 28 * (1 - progressPercentage / 100)
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-surface-900">
                    {progressPercentage}%
                  </span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center space-x-2"
              >
                <ApperIcon name="Plus" size={16} />
                <span>Add Task</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">Filters</h3>
              
              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'active', label: 'Active', count: activeTasks.length },
                    { value: 'completed', label: 'Completed', count: completedTasks.length },
                    { value: 'all', label: 'All Tasks', count: tasks.length }
                  ].map((status) => (
                    <motion.button
                      key={status.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFilters(prev => ({ ...prev, status: status.value }))}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                        filters.status === status.value
                          ? 'bg-primary text-white'
                          : 'bg-surface-50 text-surface-700 hover:bg-surface-100'
                      }`}
                    >
                      <span className="font-medium">{status.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        filters.status === status.value
                          ? 'bg-white bg-opacity-20 text-white'
                          : 'bg-surface-200 text-surface-600'
                      }`}>
                        {status.count}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredTasks.length === 0 ? (
              <EmptyState 
                title={filters.status === 'completed' ? "No completed tasks yet" : "No tasks found"}
                description={filters.status === 'completed' ? "Complete some tasks to see them here" : "Create your first task to get started"}
                actionLabel="Add Task"
                onAction={() => setShowAddForm(true)}
              />
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      categories={categories}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowAddForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-surface-900">Add New Task</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddForm(false)}
                    className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Task Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title..."
                      className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Add more details..."
                      rows={3}
                      className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Due Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-4 py-3 border border-surface-300 text-surface-700 rounded-xl font-medium hover:bg-surface-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                    >
                      Create Task
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskCard({ task, categories, onToggle, onDelete, index }) {
  const category = categories.find(c => c.name === task.category);
  const isOverdue = task.dueDate && !task.completed && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate));
  
  const priorityColors = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-gray-400'
  };

  const priorityBadgeColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-gray-100 text-gray-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      layout
      className={`bg-white rounded-2xl shadow-soft border-l-4 ${priorityColors[task.priority]} p-6 hover:shadow-card transition-all duration-200 ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-accent border-accent'
              : 'border-surface-300 hover:border-accent'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <ApperIcon name="Check" size={14} className="text-white" />
            </motion.div>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold transition-all ${
                task.completed 
                  ? 'text-surface-500 line-through' 
                  : 'text-surface-900'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`mt-1 transition-all ${
                  task.completed 
                    ? 'text-surface-400' 
                    : 'text-surface-600'
                }`}>
                  {task.description}
                </p>
              )}

              {/* Badges */}
              <div className="flex items-center space-x-3 mt-3">
                {category && (
                  <span 
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    <ApperIcon name={category.icon} size={12} />
                    <span>{category.name}</span>
                  </span>
                )}
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityBadgeColors[task.priority]}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>

                {task.dueDate && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isOverdue 
                      ? 'bg-red-100 text-red-800' 
                      : isToday(parseISO(task.dueDate))
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-surface-100 text-surface-800'
                  }`}>
                    {isToday(parseISO(task.dueDate)) 
                      ? 'Due Today' 
                      : format(parseISO(task.dueDate), 'MMM d')
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(task.id)}
              className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <ApperIcon name="Trash2" size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-32"></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-surface-200 rounded w-20"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-surface-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-soft p-6"
              >
                <div className="animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-surface-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-surface-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-surface-200 rounded w-1/2 mb-3"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-surface-200 rounded w-20"></div>
                        <div className="h-6 bg-surface-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ApperIcon name="AlertCircle" size={64} className="text-red-500 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-xl font-semibold text-surface-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-surface-600 mb-6">{message}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name="CheckSquare" className="w-20 h-20 text-surface-300 mx-auto mb-6" />
      </motion.div>
      <h3 className="text-xl font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-600 mb-8 max-w-md mx-auto">{description}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAction}
        className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
      >
        <ApperIcon name="Plus" size={16} />
        <span>{actionLabel}</span>
      </motion.button>
    </motion.div>
  );
}

export default MainFeature;