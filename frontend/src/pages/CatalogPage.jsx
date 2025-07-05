import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaShoppingCart, FaChevronLeft, FaChevronRight, FaSort, FaSortUp, FaSortDown, FaFilter } from 'react-icons/fa'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { categories } from '../data/products'

const CatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const { products, loading, error, pagination, fetchProductsByCategory } = useProducts()
  const { addToCart } = useCart()
  const [notification, setNotification] = useState({ show: false, message: '' })

  // Get min and max prices from products for input placeholders
  const priceStats = products.length > 0 ? {
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price))
  } : { min: 0, max: 1000 }

  // Memoize the fetchProductsByCategory call
  const fetchProducts = useCallback(() => {
    const category = selectedCategory === 'all' ? '' : selectedCategory
    fetchProductsByCategory(category, currentPage, 12)
  }, [selectedCategory, currentPage, fetchProductsByCategory])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Reset to first page when category, sort, or price range changes
  useEffect(() => {
    setCurrentPage(0)
  }, [selectedCategory, sortBy, sortOrder, priceRange])

  const handleAddToCart = (product) => {
    addToCart(product)
    setNotification({ show: true, message: `${product.name} added to cart!` })
    setTimeout(() => setNotification({ show: false, message: '' }), 3000)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handlePriceRangeChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }))
  }

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      if (priceRange.min && product.price < parseFloat(priceRange.min)) return false
      if (priceRange.max && product.price > parseFloat(priceRange.max)) return false
      return true
    })
    .sort((a, b) => {
      let aValue, bValue
      
      if (sortBy === 'name') {
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
      } else if (sortBy === 'price') {
        aValue = a.price
        bValue = b.price
      } else {
        return 0
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

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
      <div className="flex justify-center items-center space-x-3 mt-12">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 0}
          className="p-3 rounded-xl border border-white/20 dark:border-gray-700/50 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>

        {startPage > 0 && (
          <>
            <button
              onClick={() => handlePageChange(0)}
              className="px-4 py-3 rounded-xl border border-white/20 dark:border-gray-700/50 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200 hover:shadow-lg"
            >
              1
            </button>
            {startPage > 1 && (
              <span className="px-3 text-gray-400 dark:text-gray-500">•••</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-3 rounded-xl border transition-all duration-200 ${
              page === pagination.currentPage
                ? 'bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white border-blue-600/50 shadow-lg shadow-blue-500/25 backdrop-blur-sm'
                : 'border-white/20 dark:border-gray-700/50 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30 hover:shadow-lg'
            }`}
          >
            {page + 1}
          </button>
        ))}

        {endPage < pagination.totalPages - 1 && (
          <>
            {endPage < pagination.totalPages - 2 && (
              <span className="px-3 text-gray-400 dark:text-gray-500">•••</span>
            )}
            <button
              onClick={() => handlePageChange(pagination.totalPages - 1)}
              className="px-4 py-3 rounded-xl border border-white/20 dark:border-gray-700/50 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200 hover:shadow-lg"
            >
              {pagination.totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages - 1}
          className="p-3 rounded-xl border border-white/20 dark:border-gray-700/50 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // Simple Price Range Input Component
  const PriceRangeInput = () => {
    return (
      <div className="relative">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <FaFilter className="text-blue-500" />
          Price Range
        </label>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="number"
              placeholder={`Min $${priceStats.min}`}
              value={priceRange.min}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/50 rounded-xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <span className="text-lg">-</span>
          </div>
          <div className="flex-1">
            <input
              type="number"
              placeholder={`Max $${priceStats.max}`}
              value={priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/50 rounded-xl bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-600 dark:text-red-400">
            <h2 className="text-2xl font-bold">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Notification */}
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              {notification.message}
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 mb-8 text-center tracking-tight">
            Discover Our Products
          </h1>
          
          {/* Category Filter - Simple Transitions */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 border-2 backdrop-blur-sm hover:scale-105 hover:-translate-y-1 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white border-blue-600/50 shadow-blue-500/25'
                    : 'bg-white/30 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 border-white/30 dark:border-gray-600/30 hover:shadow-xl'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Filters and Sort - Reorganized Layout */}
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-8 border border-white/30 dark:border-gray-700/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sort Options - Left Side */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <FaSort className="text-blue-500" />
                  Sort By
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSort('name')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all duration-200 ${
                      sortBy === 'name'
                        ? 'bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white border-blue-600/50 shadow-lg shadow-blue-500/25 backdrop-blur-sm'
                        : 'bg-white/30 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-white/30 dark:border-gray-600/30 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:shadow-lg backdrop-blur-sm'
                    }`}
                  >
                    <span>Name</span>
                    {sortBy === 'name' && (
                      sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
                  </button>
                  <button
                    onClick={() => handleSort('price')}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all duration-200 ${
                      sortBy === 'price'
                        ? 'bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white border-blue-600/50 shadow-lg shadow-blue-500/25 backdrop-blur-sm'
                        : 'bg-white/30 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-white/30 dark:border-gray-600/30 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:shadow-lg backdrop-blur-sm'
                    }`}
                  >
                    <span>Price</span>
                    {sortBy === 'price' && (
                      sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
                  </button>
                </div>
              </div>

              {/* Price Range Input - Right Side */}
              <PriceRangeInput />
            </div>
          </div>
        </div>

        {/* Product Grid - Fixed Heights for Consistency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -4 }}
              className="group bg-white/10 dark:bg-gray-800/10 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-800/20 flex flex-col h-full"
            >
              {/* Product Image - Fixed Height */}
              <div className="relative aspect-square overflow-hidden flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Glass Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Out of Stock Badge */}
                {product.stock === 0 && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Quick Add to Cart Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="bg-white/90 backdrop-blur-sm text-gray-900 px-5 py-3 rounded-full font-semibold shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:bg-white"
                  >
                    <FaShoppingCart className="inline-block mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Info - Flexible Height with Consistent Spacing */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 text-lg min-h-[3.5rem]">
                  {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow min-h-[2.5rem]">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    ${product.price.toFixed(2)}
                  </span>
                  <Link
                    to={`/product/${product.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold text-sm transition-all duration-200 hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination />

        {/* Empty State */}
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 dark:text-gray-500 text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-3">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-500 text-lg">
              Try adjusting your filters or browse a different category
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogPage
  