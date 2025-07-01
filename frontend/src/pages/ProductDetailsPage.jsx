import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import Toast from '../components/Toast'
import { FaPlus, FaMinus, FaShoppingCart, FaArrowRight, FaStar, FaRegStar, FaHeart } from 'react-icons/fa'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, loading } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  // Find the product by ID
  const product = products.find(p => p.id === parseInt(id))
  
  // Get recommended products (same category, different product)
  const recommendedProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .sort(() => 0.5 - Math.random()) // Shuffle array
      .slice(0, 4) // Take only first 4 items
  }, [product])
  
  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id])
  
  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    await addToCart(product, quantity)
    setToastMessage('Added to cart successfully!')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    setIsAddingToCart(false)
  }

  const handleBuyNow = async () => {
    setIsAddingToCart(true)
    await addToCart(product, quantity)
    setIsAddingToCart(false)
    navigate('/cart')
  }
  
  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
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
        
        {/* Recommended Products Section */}
        {recommendedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-24 max-w-6xl mx-auto px-4 text-center"
          >
            <div className="flex flex-col items-center mb-10 relative">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"></div>
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-center mb-3"
              >
                Recommended For You
              </motion.h2>
              <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-6">
                Products you might love based on your interests
              </p>
              <Link 
                to="/catalog"
                className="relative group px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium flex items-center overflow-hidden"
              >
                <span className="relative z-10">Explore More</span>
                <motion.div
                  initial={{ x: -100 }}
                  whileHover={{ x: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.6 }}
                  className="ml-2 relative z-10"
                >
                  <FaArrowRight className="h-3 w-3" />
                </motion.span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 relative z-10 justify-items-center mx-auto">
              {recommendedProducts.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden 
                            border border-white/20 dark:border-gray-700/30 shadow-xl 
                            hover:shadow-blue-500/10 dark:hover:shadow-purple-500/10 transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden group">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <Link to={`/product/${item.id}`} className="block">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="px-5 py-2.5 bg-white/20 backdrop-blur-md border border-white/30 
                                        rounded-full text-white font-medium shadow-lg 
                                        flex items-center gap-2 transition-all">
                          View Details
                          <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <FaArrowRight className="ml-1 h-3 w-3" />
                          </motion.span>
                        </span>
                      </motion.div>
                    </Link>
                    
                    {/* Price tag */}
                    <div className="absolute top-3 right-3 bg-white/80 dark:bg-black/50 backdrop-blur-md 
                                   px-3 py-1.5 rounded-full text-sm font-bold text-gray-900 dark:text-white 
                                   shadow-lg border border-white/30 dark:border-gray-800/50">
                      ${item.price.toFixed(2)}
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600/90 to-purple-600/90 
                                   px-3 py-1 rounded-full text-xs font-medium text-white 
                                   shadow-lg backdrop-blur-md">
                      {item.category}
                    </div>
                  </div>
                  
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 h-10 mx-auto">
                      {item.description}
                    </p>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(item, 1);
                        setToastMessage(`Added ${item.name} to cart`);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 
                                text-white rounded-xl flex items-center justify-center gap-2 
                                transition-all duration-300 transform hover:scale-[1.02] font-medium"
                    >
                      <FaShoppingCart className="h-4 w-4" />
                      Add to Cart
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="bg-white/30 rounded-full p-1 ml-1"
                      >
                        +1
                      </motion.span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}