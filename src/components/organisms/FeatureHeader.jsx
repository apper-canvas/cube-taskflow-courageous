import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBarCircle from '@/components/molecules/ProgressBarCircle';
import Button from '@/components/atoms/Button';

const FeatureHeader = ({ title, activeTaskCount, progressPercentage, onAddTask }) => {
    return (
        <div className="bg-white border-b border-surface-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">
                            {title}
                        </h1>
                        <p className="mt-1 text-surface-600">
                            {activeTaskCount} active tasks • {progressPercentage}% complete
                        </p>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                        <ProgressBarCircle percentage={progressPercentage} />
                        
                        <Button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onAddTask}
                            className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center space-x-2"
                        >
                            <ApperIcon name="Plus" size={16} />
                            <span>Add Task</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeatureHeader;