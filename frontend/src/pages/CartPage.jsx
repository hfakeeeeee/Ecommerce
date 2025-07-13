import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft, FaCheck, FaCreditCard } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedItems, setSelectedItems] = useState(new Set())

  // Initialize all items as selected when cart loads
  useEffect(() => {
    if (items.length > 0) {
      const allItemIds = new Set(items.map(item => item.productId))
      setSelectedItems(allItemIds)
    } else {
      setSelectedItems(new Set())
    }
  }, [items])

  const handleQuantityChange = (productId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleItemSelection = (productId) => {
    const newSelectedItems = new Set(selectedItems)
    if (newSelectedItems.has(productId)) {
      newSelectedItems.delete(productId)
    } else {
      newSelectedItems.add(productId)
    }
    setSelectedItems(newSelectedItems)
  }

  const handleSelectAll = () => {
    if (selectedItems.size === items.length) {
      // If all are selected, deselect all
      setSelectedItems(new Set())
    } else {
      // Select all
      const allItemIds = new Set(items.map(item => item.productId))
      setSelectedItems(allItemIds)
    }
  }

  const getSelectedItemsTotal = () => {
    return items
      .filter(item => selectedItems.has(item.productId))
      .reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getSelectedItemsCount = () => {
    return items
      .filter(item => selectedItems.has(item.productId))
      .reduce((total, item) => total + item.quantity, 0)
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    
    if (selectedItems.size === 0) {
      alert('Please select at least one item to checkout')
      return
    }
    
    // Store selected items in session storage for checkout process
    const selectedCartItems = items.filter(item => selectedItems.has(item.productId))
    sessionStorage.setItem('selectedCartItems', JSON.stringify(selectedCartItems))
    navigate('/payment')
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md mx-auto"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/catalog"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shopping Cart
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Review and select your items
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Select All Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600">
                <label className="flex items-center space-x-4 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === items.length && items.length > 0}
                      onChange={handleSelectAll}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                    />
                    {selectedItems.size === items.length && items.length > 0 && (
                      <FaCheck className="absolute inset-0 w-5 h-5 text-white pointer-events-none" />
                    )}
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Select All ({items.length} items)
                  </span>
                </label>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      {/* Desktop Layout */}
                      <div className="hidden md:flex items-center gap-6">
                        {/* Checkbox and Image */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.productId)}
                              onChange={() => handleItemSelection(item.productId)}
                              className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                            />
                            {selectedItems.has(item.productId) && (
                              <FaCheck className="absolute inset-0 w-5 h-5 text-white pointer-events-none" />
                            )}
                          </div>
                          <div className="relative group">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-20 h-20 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200"></div>
                          </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 truncate">
                            {item.productName}
                          </h3>
                          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            ${item.price}
                          </p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-xl p-2">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                            >
                              <FaPlus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {/* Total Price */}
                          <div className="text-right min-w-[80px]">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 flex-shrink-0"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="md:hidden">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.productId)}
                              onChange={() => handleItemSelection(item.productId)}
                              className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                            />
                            {selectedItems.has(item.productId) && (
                              <FaCheck className="absolute inset-0 w-5 h-5 text-white pointer-events-none" />
                            )}
                          </div>
                          <div className="relative group flex-shrink-0">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                              {item.productName}
                            </h3>
                            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                              ${item.price}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 flex-shrink-0"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-xl p-2">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
                            >
                              <FaPlus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <FaCreditCard className="mr-3 text-indigo-600 dark:text-indigo-400" />
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                  <div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Selected Items
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getSelectedItemsCount()} items
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    ${getSelectedItemsTotal().toFixed(2)}
                  </span>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Cart: ${getCartTotal().toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={clearCart}
                  className="w-full px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold rounded-xl transition-all duration-200 border border-red-200 dark:border-red-800"
                >
                  Clear Cart
                </button>
                
                {user ? (
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.size === 0}
                    className={`w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
                      selectedItems.size === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {selectedItems.size === 0 ? 'Select Items to Checkout' : 'Proceed to Checkout'}
                  </button>
                ) : (
                  <div className="text-center">
                    <Link
                      to="/login"
                      state={{ from: '/cart' }}
                      className="inline-block w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Login to Checkout
                    </Link>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      Please login or register to complete your purchase
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 