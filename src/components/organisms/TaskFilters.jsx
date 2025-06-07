import React from 'react';
import { motion } from 'framer-motion';
import Select from '@/components/atoms/Select';

const TaskFilters = ({ filters, categories, onFilterChange, activeTaskCount, completedTaskCount, allTaskCount }) => {
    return (
        <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Filters</h3>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                    Status
                </label>
                <div className="space-y-2">
                    {[
                        { value: 'active', label: 'Active', count: activeTaskCount },
                        { value: 'completed', label: 'Completed', count: completedTaskCount },
                        { value: 'all', label: 'All Tasks', count: allTaskCount }
                    ].map((status) => (
                        <motion.button
                            key={status.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onFilterChange('status', status.value)}
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

            <div className="mb-6">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                    Category
                </label>
                <Select
                    value={filters.category}
                    onChange={(e) => onFilterChange('category', e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </Select>
            </div>

            <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                    Priority
                </label>
                <Select
                    value={filters.priority}
                    onChange={(e) => onFilterChange('priority', e.target.value)}
                >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                </Select>
            </div>
        </div>
    );
};

export default TaskFilters;