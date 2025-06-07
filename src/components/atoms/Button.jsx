import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className, onClick, whileHover, whileTap, type = 'button', ...rest }) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            className={className}
            whileHover={whileHover}
            whileTap={whileTap}
            {...rest}
        >
            {children}
        </motion.button>
    );
};

export default Button;