import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaShoppingCart, FaStar, FaRegStar, FaStarHalfAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { categories } from '../data/products'

const CatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const { products, loading, error, pagination, fetchProductsByCategory } = useProducts()
  const { addToCart } = useCart()
  const [notification, setNotification] = useState({ show: false, message: '' })

  // Memoize the fetchProductsByCategory call
  const fetchProducts = useCallback(() => {
    const category = selectedCategory === 'all' ? '' : selectedCategory
    fetchProductsByCategory(category, currentPage, 12)
  }, [selectedCategory, currentPage, fetchProductsByCategory])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(0)
  }, [selectedCategory])

  const handleAddToCart = (product) => {
    addToCart(product)
    setNotification({ show: true, message: `${product.name} added to cart!` })
    setTimeout(() => setNotification({ show: false, message: '' }), 3000)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  // Helper for star rating (static 4.5 for demo)
  const renderStars = (rating = 4.5) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} />)
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} />)
      } else {
        stars.push(<FaRegStar key={i} />)
      }
    }
    return <span className="flex items-center text-yellow-400">{stars}</span>
  }

  // Pagination component
  const Pagination = () => {
    if (pagination.totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(0, pagination.currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(pagination.totalPages - 1, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 0}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>

        {startPage > 0 && (
          <>
            <button
              onClick={() => handlePageChange(0)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              1
            </button>
            {startPage > 1 && (
              <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              page === pagination.currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {page + 1}
          </button>
        ))}

        {endPage < pagination.totalPages - 1 && (
          <>
            {endPage < pagination.totalPages - 2 && (
              <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
            )}
            <button
              onClick={() => handlePageChange(pagination.totalPages - 1)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {pagination.totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages - 1}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600 dark:text-red-400">
            <h2 className="text-2xl font-bold">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notification */}
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {notification.message}
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center tracking-tight">
            Our Products
          </h1>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-semibold shadow transition-all border-2 border-transparent ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        {pagination.totalElements > 0 && (
          <div className="text-center mb-6 text-gray-600 dark:text-gray-400">
            Showing {pagination.currentPage * pagination.size + 1} to{' '}
            {Math.min((pagination.currentPage + 1) * pagination.size, pagination.totalElements)} of{' '}
            {pagination.totalElements} products
          </div>
        )}

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -8, scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-shadow group relative border border-gray-100 dark:border-gray-700"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Gradient overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 pointer-events-none" />
                {/* Out of Stock badge */}
                {product.stock === 0 && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Out of Stock</span>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
                  {product.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2 min-h-[40px]">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ${product.price.toFixed(2)}
                  </span>
                  {renderStars(4.5)}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow transition-all"
                    disabled={product.stock === 0}
                  >
                    <FaShoppingCart className="inline-block mr-2" />
                    Add to Cart
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1 bg-white dark:bg-gray-700 border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 py-2 px-4 rounded-lg font-semibold shadow transition-all text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        <Pagination />

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-600 dark:text-gray-400">
              No products found in this category
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogPage
  