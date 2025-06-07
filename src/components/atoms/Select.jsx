import React from 'react';

const Select = ({ children, className, ...props }) => {
    return (
        <select
            className={`w-full px-4 py-3 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className || ''}`}
            {...props}
        >
            {children}
        </select>
    );
};

export default Select;