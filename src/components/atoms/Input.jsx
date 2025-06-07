import React from 'react';

const Input = ({ className, ...props }) => {
    return (
        <input
            className={`w-full px-4 py-3 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${className || ''}`}
            {...props}
        />
    );
};

export default Input;