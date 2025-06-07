import React from 'react';
import { motion } from 'framer-motion';

const LoadingContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-32"></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-surface-200 rounded w-20"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-surface-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 space-y-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-soft p-6"
              >
                <div className="animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-surface-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-surface-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-surface-200 rounded w-1/2 mb-3"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-surface-200 rounded w-20"></div>
                        <div className="h-6 bg-surface-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingContent;