import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const TaskBadge = ({ label, icon, className, style }) => {
    return (
        <span
            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${className || ''}`}
            style={style}
        >
            {icon && <ApperIcon name={icon} size={12} />}
            <span>{label}</span>
        </span>
    );
};

export default TaskBadge;