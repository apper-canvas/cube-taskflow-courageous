import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyContent = ({ title, description, actionLabel, onAction }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name="CheckSquare" className="w-20 h-20 text-surface-300 mx-auto mb-6" />
      </motion.div>
      <h3 className="text-xl font-semibold text-surface-900 mb-2">{title}</h3>
      <p className="text-surface-600 mb-8 max-w-md mx-auto">{description}</p>
      <Button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAction}
        className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors inline-flex items-center space-x-2"
      >
        <ApperIcon name="Plus" size={16} />
        <span>{actionLabel}</span>
      </Button>
    </motion.div>
  );
};

export default EmptyContent;