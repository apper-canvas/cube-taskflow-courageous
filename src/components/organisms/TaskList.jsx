import React from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskItem from '@/components/molecules/TaskItem';

const TaskList = ({ tasks, categories, onToggleTask, onDeleteTask, onReorderTasks, loading }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);
      
      const newOrder = arrayMove(tasks, oldIndex, newIndex);
      const taskIds = newOrder.map(task => task.id);
      onReorderTasks(taskIds);
    }
  };

  return (
    <div className={`space-y-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
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
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TaskList;