import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({ label, type = 'text', children, className, ...props }) => {
    const renderInput = () => {
        switch (type) {
            case 'select':
                return <Select {...props}>{children}</Select>;
            case 'textarea':
                return <Textarea {...props} />;
            default:
                return <Input type={type} {...props} />;
        }
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-surface-700 mb-2">
                {label}
            </label>
            {renderInput()}
        </div>
    );
};

export default FormField;