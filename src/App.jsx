import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import routes, { routeArray } from './config/routes';
import ApperIcon from './components/ApperIcon';

function App() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const currentRoute = routes[activeTab];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen bg-white ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-surface-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </motion.button>
          <h1 className="text-xl font-semibold text-surface-900">TaskFlow</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
        >
          <ApperIcon name={darkMode ? "Sun" : "Moon"} size={20} />
        </motion.button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-70 bg-white z-50 lg:hidden"
            >
              <Sidebar 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                routeArray={routeArray}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                onItemClick={() => setSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-70 bg-white border-r border-surface-200">
          <Sidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            routeArray={routeArray}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <currentRoute.component />
          </motion.div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16 lg:mt-0"
      />
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, routeArray, darkMode, toggleDarkMode, onItemClick }) {
  return (
    <div className="h-full flex flex-col">
      {/* Logo and Title */}
      <div className="p-6 border-b border-surface-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-surface-900">TaskFlow</h1>
            <p className="text-sm text-surface-500">Effortless productivity</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {routeArray.map((route) => (
            <motion.button
              key={route.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab(route.id);
                onItemClick?.();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === route.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
              }`}
            >
              <ApperIcon 
                name={route.icon} 
                size={20}
                className={activeTab === route.id ? 'text-white' : 'text-surface-500'}
              />
              <span className="font-medium">{route.label}</span>
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Dark Mode Toggle */}
      <div className="p-4 border-t border-surface-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleDarkMode}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-surface-600 hover:bg-surface-100 hover:text-surface-900 transition-all duration-200"
        >
          <ApperIcon name={darkMode ? "Sun" : "Moon"} size={20} className="text-surface-500" />
          <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </motion.button>
      </div>
    </div>
  );
}

export default App;