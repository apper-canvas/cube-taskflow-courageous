import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const AddTaskModal = ({ formData, onFormChange, categories, onSubmit, onClose }) => {
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
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
                        <Button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                        >
                            <ApperIcon name="X" size={20} />
                        </Button>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <FormField
                            label="Task Title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => onFormChange('title', e.target.value)}
                            placeholder="Enter task title..."
                            required
                        />

                        <FormField
                            label="Description (Optional)"
                            type="textarea"
                            value={formData.description}
                            onChange={(e) => onFormChange('description', e.target.value)}
                            placeholder="Add more details..."
                            rows={3}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                label="Category"
                                type="select"
                                value={formData.category}
                                onChange={(e) => onFormChange('category', e.target.value)}
                            >
                                <option value="">Select category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </FormField>

                            <FormField
                                label="Priority"
                                type="select"
                                value={formData.priority}
                                onChange={(e) => onFormChange('priority', e.target.value)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </FormField>
                        </div>

                        <FormField
                            label="Due Date (Optional)"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => onFormChange('dueDate', e.target.value)}
                        />

                        <div className="flex space-x-3 pt-4">
                            <Button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-surface-300 text-surface-700 rounded-xl font-medium hover:bg-surface-50 transition-colors"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
                            >
                                Create Task
                            </Button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </>
    );
};

export default AddTaskModal;