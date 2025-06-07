import React from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ApperIcon from '@/components/ApperIcon';
import TaskBadge from '@/components/molecules/TaskBadge';
import Button from '@/components/atoms/Button';

const TaskItem = ({ task, categories, onToggle, onDelete, index }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
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
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            layout
            className={`bg-white rounded-2xl shadow-soft border-l-4 ${priorityColors[task.priority]} p-6 hover:shadow-card transition-all duration-200 ${
                task.completed ? 'opacity-75' : ''
            } ${isDragging ? 'dragging' : ''}`}
        >
<div className="flex items-start space-x-4">
                <div className="flex items-center space-x-2">
                    <div
                        {...attributes}
                        {...listeners}
                        className="drag-handle p-1 hover:bg-surface-100 rounded transition-colors cursor-grab active:cursor-grabbing"
                        aria-label="Drag to reorder task"
                    >
                        <ApperIcon name="GripVertical" size={16} className="text-surface-400" />
                    </div>
                    
                    <Button
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
                    </Button>
                </div>
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

                            <div className="flex items-center space-x-3 mt-3">
                                {category && (
                                    <TaskBadge 
                                        label={category.name}
                                        icon={category.icon}
                                        style={{ backgroundColor: `${category.color}20`, color: category.color }}
                                    />
                                )}
                                
                                <TaskBadge 
                                    label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    className={priorityBadgeColors[task.priority]}
                                />

                                {task.dueDate && (
                                    <TaskBadge 
                                        label={
                                            isToday(parseISO(task.dueDate)) 
                                                ? 'Due Today' 
                                                : format(parseISO(task.dueDate), 'MMM d')
                                        }
                                        className={`${
                                            isOverdue 
                                                ? 'bg-red-100 text-red-800' 
                                                : isToday(parseISO(task.dueDate))
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-surface-100 text-surface-800'
                                        }`}
                                    />
                                )}
                            </div>
                        </div>

                        <Button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onDelete(task.id)}
                            className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <ApperIcon name="Trash2" size={16} />
                        </Button>
                    </div>
</div>
            </div>
            
            {/* Keyboard accessibility instructions */}
            <div className="sr-only">
                Press Space to grab this task, then use arrow keys to move it, and Space again to drop it.
            </div>
        </motion.div>
    );
};

export default TaskItem;