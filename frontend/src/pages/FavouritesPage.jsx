import { useFavourites } from '../context/FavouritesContext';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart, FaEye, FaStar, FaTag } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function FavouritesPage() {
  const { favourites, removeFromFavourites } = useFavourites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/30 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHeart className="text-white w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Access Your Favorites
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                Please log in to view and manage your favorite items.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg"
              >
                Log In Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/30 py-12">
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <FaHeart className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Your Favorites
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Discover and manage all the products you've fallen in love with
          </p>
          {favourites.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 dark:border-gray-700/30">
              <FaStar className="text-yellow-500 w-5 h-5" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {favourites.length} {favourites.length === 1 ? 'favorite item' : 'favorite items'}
              </span>
            </div>
          )}
        </motion.div>

        {favourites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-12 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <FaHeart className="text-gray-400 dark:text-gray-500 w-16 h-16" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No Favorites Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                Start building your wishlist by exploring our amazing collection of products. 
                Click the heart icon on any product to add it to your favorites!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/catalog')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg inline-flex items-center gap-3"
              >
                <FaShoppingCart className="w-5 h-5" />
                Explore Products
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {favourites.map((favorite) => (
                <motion.div
                  key={favorite.id}
                  variants={cardVariants}
                  layout
                  exit="exit"
                  onHoverStart={() => setHoveredCard(favorite.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="group relative"
                >
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
                    {/* Image Container with Overlay */}
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={favorite.product.image}
                        alt={favorite.product.name}
                        className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.7 }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Price Badge */}
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-4 right-4"
                      >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                          <FaTag className="w-3 h-3" />
                          ${favorite.product.price.toFixed(2)}
                        </div>
                      </motion.div>

                      {/* Favorite Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                          <FaHeart className="text-white w-5 h-5" />
                        </div>
                      </div>

                      {/* Quick Action Overlay */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: hoveredCard === favorite.id ? 1 : 0,
                          y: hoveredCard === favorite.id ? 0 : 20
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/product/${favorite.product.id}`)}
                            className="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                            title="View Details"
                          >
                            <FaEye className="text-gray-700 dark:text-gray-300 w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {favorite.product.name}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {favorite.product.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/product/${favorite.product.id}`)}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg flex items-center justify-center gap-2"
                        >
                          <FaEye className="w-4 h-4" />
                          View Details
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromFavourites(favorite.product.id)}
                          className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-all duration-300 flex items-center justify-center shadow-lg border border-pink-200 dark:border-pink-800"
                          title="Remove from favorites"
                        >
                          <FaTrash className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}