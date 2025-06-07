import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ApperIcon name="AlertTriangle" size={64} className="text-surface-400 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-4xl font-bold text-surface-900 mb-2">404</h1>
        <p className="text-surface-600 mb-6">Oops! This page seems to have wandered off.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors"
        >
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
}

export default NotFound;