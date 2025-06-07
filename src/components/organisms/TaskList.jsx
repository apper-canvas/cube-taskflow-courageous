import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TaskItem from '@/components/molecules/TaskItem';

const TaskList = ({ tasks, categories, onToggleTask, onDeleteTask }) => {
    return (
        <div className="space-y-4">
            <AnimatePresence mode="popLayout">
                {tasks.map((task, index) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        categories={categories}
                        onToggle={onToggleTask}
                        onDelete={onDeleteTask}
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default TaskList;