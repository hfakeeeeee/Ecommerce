import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import Toast from '../components/Toast'
import { FaPlus, FaMinus, FaShoppingCart, FaHeart, FaShare, FaStar, FaTruck, FaShieldAlt, FaUndo } from 'react-icons/fa'
import { useProducts } from '../context/ProductContext'
import { useFavourites } from '../context/FavouritesContext'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { products } = useProducts()
  const { toggleFavourite, isFavourited } = useFavourites();
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch((err) => {
        setError('Product not found')
        setLoading(false)
      })
  }, [id])
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])
  
  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
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

  const handleWishlist = () => {
    toggleFavourite(product);
    setToastMessage(isFavourited(product.id) ? 'Removed from favourites!' : 'Added to favourites!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  // Share button handler
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setToastMessage('Product link copied!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Return to Catalog
          </button>
        </div>
      </div>
    )
  }

  // Recommendation logic (only after product is loaded)
  const recommendations = products
    .filter(
      (p) => p.id !== product.id && p.category === product.category
    )
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Toast
        message={toastMessage}
        type="cart"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back to Catalog - left aligned */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-start"
        >
          <button
            onClick={() => navigate('/catalog')}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Catalog
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Product Image Only */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative group w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Badge */}
              {product.badge && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-6 left-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                >
                  {product.badge}
                </motion.span>
              )}
              {/* Action Buttons */}
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlist}
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                    isFavourited(product.id)
                      ? 'bg-pink-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-900/20'
                  }`}
                >
                  <FaHeart className={`w-5 h-5 ${isFavourited(product.id) ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center shadow-lg transition-all duration-300"
                >
                  <FaShare className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col space-y-8"
          >
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ${product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    ${product.oldPrice}
                  </span>
                )}
                {product.oldPrice && (
                  <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                    Save ${(product.oldPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Category
                </h3>
                <p className="text-gray-600 dark:text-gray-400 capitalize text-lg">{product.category}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Stock Status
                </h3>
                <p className={`text-lg font-medium ${product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <FaTruck className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">Free Shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaUndo className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-600 dark:text-gray-400">30 Day Returns</span>
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <label className="text-lg font-semibold text-gray-900 dark:text-white">Quantity:</label>
                <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-40"
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className="px-4 text-lg font-medium w-10 text-center select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-40"
                    disabled={quantity >= product.stock}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.stock === 0}
                >
                  Buy Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-semibold text-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart className="w-5 h-5" />
                  Add to Cart
                </motion.button>
              </div>
              
              {product.stock === 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-red-600 dark:text-red-400 text-center font-medium">
                    This product is currently out of stock
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recommendation Section */}
        {recommendations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">You Might Also Like</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Discover more products in this category</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -8 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group flex flex-col h-[370px]"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={rec.image}
                      alt={rec.name}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 truncate" title={rec.name}>
                      {rec.name.length > 40 ? rec.name.slice(0, 40) + '…' : rec.name}
                    </h3>
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-xl mb-4 block">
                      ${rec.price}
                    </span>
                    <div className="mt-auto">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/product/${rec.id}`)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold"
                      >
                        View Details
                      </motion.button>
                    </div>
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