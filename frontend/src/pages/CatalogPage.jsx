import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaShoppingCart, 
  FaChevronLeft, 
  FaChevronRight, 
  FaSort, 
  FaSortUp, 
  FaSortDown, 
  FaFilter,
  FaSearch,
  FaTh,
  FaList,
  FaTimes,
  FaAdjust
} from 'react-icons/fa'
import { useProducts } from '../context/ProductContext'
import { useCart } from '../context/CartContext'
import { categories } from '../data/products'

// Modern Price Range Component with enhanced styling
function PriceRangeInput({ priceStats, priceRange, onChange }) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <FaAdjust className="text-blue-500" />
        Price Range
      </label>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
          <input
            type="number"
            placeholder={`${priceStats.min}`}
            value={priceRange.min}
            onChange={(e) => onChange('min', e.target.value)}
            className="w-full pl-8 pr-4 py-3 border-0 rounded-2xl bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
          />
        </div>
        <div className="flex items-center text-gray-400">
          <div className="w-3 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
          <input
            type="number"
            placeholder={`${priceStats.max}`}
            value={priceRange.max}
            onChange={(e) => onChange('max', e.target.value)}
            className="w-full pl-8 pr-4 py-3 border-0 rounded-2xl bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
          />
        </div>
      </div>
    </div>
  )
}

const CatalogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [showFilters, setShowFilters] = useState(false)
  const { products, loading, error, pagination, fetchProductsByCategory } = useProducts()
  const { addToCart } = useCart()
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })

  // Get min and max prices from products for input placeholders
  const priceStats = products.length > 0 ? {
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price))
  } : { min: 0, max: 1000 }

  // Debounce priceRange changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange)
    }, 400)
    return () => clearTimeout(handler)
  }, [priceRange])

  // Memoize the fetchProductsByCategory call
  const fetchProducts = useCallback(() => {
    const category = selectedCategory === 'all' ? '' : selectedCategory
    const minPrice = debouncedPriceRange.min ? parseFloat(debouncedPriceRange.min) : null
    const maxPrice = debouncedPriceRange.max ? parseFloat(debouncedPriceRange.max) : null
    fetchProductsByCategory(category, currentPage, 12, minPrice, maxPrice, searchQuery)
  }, [selectedCategory, currentPage, fetchProductsByCategory, debouncedPriceRange, searchQuery])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0)
  }, [selectedCategory, searchQuery, debouncedPriceRange])

  const handleAddToCart = (product, e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    setNotification({ 
      show: true, 
      message: `${product.name} added to cart!`, 
      type: 'success' 
    })
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handlePriceRangeChange = useCallback((type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }))
  }, [])

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' })
    setSearchQuery('')
    setSelectedCategory('all')
  }

  // Remove client-side sorting and filtering since it's now handled by the server
  const displayProducts = products

  // Modern Pagination component
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
      <div className="flex justify-center items-center space-x-2 mt-16">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 0}
          className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>

        {startPage > 0 && (
          <>
            <button
              onClick={() => handlePageChange(0)}
              className="px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-lg border border-gray-200/50 dark:border-gray-700/50"
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
            className={`px-4 py-3 rounded-xl transition-all duration-200 border ${
              page === pagination.currentPage
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600/50 shadow-lg shadow-blue-500/25'
                : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg border-gray-200/50 dark:border-gray-700/50'
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
              className="px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-lg border border-gray-200/50 dark:border-gray-700/50"
            >
              {pagination.totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages - 1}
          className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Notification */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className={`fixed top-20 right-4 px-6 py-4 rounded-2xl shadow-2xl z-50 backdrop-blur-sm border ${
                notification.type === 'success' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400/50' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-400/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                {notification.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modern Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-600 to-indigo-700 dark:from-white dark:via-blue-400 dark:to-indigo-300 mb-4 tracking-tight">
              Discover
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
              Explore our curated collection of premium products designed for modern living
            </p>
          </motion.div>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              />
            </div>
          </div>

          {/* Modern Category Pills */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 border-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600/50 shadow-lg shadow-blue-500/25'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg backdrop-blur-sm'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>

          {/* Modern Controls Bar */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Left: View Toggle & Filters */}
              <div className="flex items-center gap-4">
                <div className="flex bg-gray-100/80 dark:bg-gray-700/80 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <FaList />
                  </button>
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100/80 dark:bg-gray-700/80 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-all duration-200"
                >
                  <FaFilter />
                  Filters
                </button>
              </div>

              {/* Right: Sort Controls */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSort('name')}
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                      sortBy === 'name'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/80'
                    }`}
                  >
                    <span>Name</span>
                    {sortBy === 'name' && (
                      sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
                  </button>
                  <button
                    onClick={() => handleSort('price')}
                    className={`flex items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                      sortBy === 'price'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/80'
                    }`}
                  >
                    <span>Price</span>
                    {sortBy === 'price' && (
                      sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PriceRangeInput
                      priceStats={priceStats}
                      priceRange={priceRange}
                      onChange={handlePriceRangeChange}
                    />
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 px-4 py-3 bg-gray-100/80 dark:bg-gray-700/80 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-all duration-200"
                      >
                        <FaTimes />
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Enhanced Product Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -8 }}
              className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 ${
                viewMode === 'grid' ? 'flex flex-col h-full' : 'flex flex-row h-48'
              }`}
            >
              {/* Clickable Product Card */}
              <Link 
                to={`/product/${product.id}`}
                className={`block ${viewMode === 'grid' ? 'flex flex-col h-full' : 'flex flex-row flex-1'}`}
              >
                {/* Product Image */}
                <div className={`relative overflow-hidden ${
                  viewMode === 'grid' ? 'aspect-square flex-shrink-0' : 'w-48 flex-shrink-0'
                }`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Enhanced Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
                    {product.stock === 0 && (
                      <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Out of Stock
                      </span>
                    )}
                    {product.stock > 0 && product.stock <= 5 && (
                      <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Low Stock
                      </span>
                    )}
                  </div>

                  {/* Quick Add Button for Grid View */}
                  {viewMode === 'grid' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={product.stock === 0}
                        className="bg-white/95 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-full font-semibold shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:bg-white"
                      >
                        <FaShoppingCart className="inline-block mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className={`p-6 flex flex-col ${viewMode === 'grid' ? 'flex-grow' : 'flex-1 justify-between'}`}>
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <h3 className={`font-bold text-gray-900 dark:text-white mb-3 ${
                      viewMode === 'grid' ? 'line-clamp-2 text-lg min-h-[3.5rem]' : 'text-xl mb-2'
                    }`}>
                      {product.name}
                    </h3>
                    <p className={`text-gray-600 dark:text-gray-300 text-sm leading-relaxed ${
                      viewMode === 'grid' ? 'line-clamp-2 mb-4 flex-grow min-h-[2.5rem]' : 'line-clamp-3 mb-4'
                    }`}>
                      {product.description}
                    </p>
                  </div>
                  
                  <div className={`flex items-center justify-between ${viewMode === 'grid' ? 'mt-auto' : ''}`}>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ${product.price.toFixed(2)}
                    </span>
                    {viewMode === 'grid' && (
                      <span className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold text-sm transition-all duration-200 hover:underline">
                        View Details →
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Add to Cart Button for List View (Outside the Link) */}
              {viewMode === 'list' && (
                <div className="flex items-center p-6">
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={product.stock === 0}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    <FaShoppingCart className="inline-block mr-2" />
                    Add to Cart
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination />

        {/* Enhanced Empty State */}
        {displayProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-gray-300 dark:text-gray-600 text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-4">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-500 text-lg mb-8 max-w-md mx-auto">
              We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CatalogPage