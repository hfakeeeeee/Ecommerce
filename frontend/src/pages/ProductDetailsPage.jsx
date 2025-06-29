import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import Toast from '../components/Toast'
import { FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  // Find the product by ID
  const product = products.find(p => p.id === parseInt(id))
  
  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setToastMessage('Added to cart successfully!')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/cart')
  }
  
  // Handle product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/catalog')}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Return to Catalog
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <Toast
        message={toastMessage}
        type="cart"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/catalog')}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full">
                {product.badge}
              </span>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${product.price}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.oldPrice}
                </span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Category</h3>
                <p className="text-gray-600 dark:text-gray-400 capitalize">{product.category}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Stock Status</h3>
                <p className={product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Quantity and Add to Cart Section */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <FaMinus className={quantity <= 1 ? "text-gray-300" : "text-gray-600"} />
                  </button>
                  <span className="px-4 py-2 text-lg font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <FaPlus className={quantity >= product.stock ? "text-gray-300" : "text-gray-600"} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  disabled={product.stock === 0}
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
              {product.stock === 0 && (
                <p className="text-red-600 dark:text-red-400 text-center">
                  This product is currently out of stock
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Additional Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Product Details
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
              {/* Add more details here as needed */}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 