import React from 'react';

const Textarea = ({ className, ...props }) => {
    return (
        <textarea
            className={`w-full px-4 py-3 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none ${className || ''}`}
            {...props}
        />
    );
};

export default Textarea;