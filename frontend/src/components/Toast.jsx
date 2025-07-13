import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck, FaTimes, FaShoppingCart, FaBan } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Toast({ message, type = 'success', isVisible, onClose, action }) {
  const icons = {
    success: <FaCheck className="w-5 h-5 text-green-500" />,
    error: <FaTimes className="w-5 h-5 text-red-500" />,
    cart: <FaShoppingCart className="w-5 h-5 text-indigo-500" />,
    ban: <FaBan className="w-5 h-5 text-red-500" />
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center space-x-4 min-w-[300px]">
            <div className="flex-shrink-0">
              {icons[type]}
            </div>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white font-medium">{message}</p>
              {action && (
                <div className="mt-2 flex space-x-2">
                  <Link
                    to="/cart"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium"
                  >
                    View Cart
                  </Link>
                  <button
                    onClick={onClose}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 