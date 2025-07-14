import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaCog, FaUserCircle, FaEnvelope, FaHistory, FaHeart, FaMicrochip, FaBars } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUtils';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Catalog', href: '/catalog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const { getCartItemCount } = useCart();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

  // Helper for active nav link
  const isActive = (href) => window.location.pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-lg rounded-b-2xl border-b border-gray-200/60 dark:border-gray-800/60">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 min-h-[4rem]">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 h-16 min-w-0">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight select-none h-16 min-w-0"
            >
              <FaMicrochip className="w-7 h-7 mr-2 shrink-0" />
              <span className="truncate">TECHVERSE</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8 h-16">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.href}
                className={`relative px-2 py-1 text-base lg:text-lg font-medium transition-colors duration-200
                  ${isActive(link.href)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}
                `}
                tabIndex={0}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                <span>{link.name}</span>
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setShowMobileMenu((v) => !v)}
            aria-label="Open menu"
            aria-expanded={showMobileMenu}
            aria-controls="mobile-menu"
          >
            <FaBars className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </button>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 h-16">
            <ThemeSwitcher />
            {/* Cart Button */}
            <Link to="/cart" className="relative" tabIndex={0} aria-label="Cart">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <FaShoppingCart className="h-7 w-7 text-gray-600 dark:text-gray-300" />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white dark:border-gray-900">
                    {getCartItemCount()}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Auth/Profile Section */}
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <motion.button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-500 p-[2px] shadow-md">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                      {user.imageUrl ? (
                        <img
                          src={getImageUrl(user.imageUrl)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                          <FaUserCircle className="text-white w-7 h-7" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-500 p-[2px]">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                              {user.imageUrl ? (
                                <img
                                  src={getImageUrl(user.imageUrl)}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                                  <FaUserCircle className="text-white w-8 h-8" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white text-lg">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <FaEnvelope className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <FaCog className="w-5 h-5 mr-3" />
                          Profile Settings
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <FaHistory className="w-5 h-5 mr-3" />
                          Order History
                        </Link>
                        <Link
                          to="/favourites"
                          className="flex items-center px-4 py-3 text-base text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <FaHeart className="w-5 h-5 mr-3" />
                          Favourites
                        </Link>
                        {user.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-3 text-base text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <FaUser className="w-5 h-5 mr-3" />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-3 text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <FaSignOutAlt className="w-5 h-5 mr-3" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-lg"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors text-lg shadow-md"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            id="mobile-menu"
            className="md:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-40 rounded-b-2xl border-b border-gray-200/60 dark:border-gray-800/60"
          >
            <nav className="flex flex-col items-center py-6 space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`w-full text-center py-3 text-base font-medium rounded-xl transition-colors duration-200
                    ${isActive(link.href)
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}
                  `}
                  onClick={() => setShowMobileMenu(false)}
                  tabIndex={0}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-center gap-4 mt-4">
                <ThemeSwitcher />
                <Link to="/cart" className="relative" tabIndex={0} aria-label="Cart">
                  <FaShoppingCart className="h-7 w-7 text-gray-600 dark:text-gray-300" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white dark:border-gray-900">
                      {getCartItemCount()}
                    </span>
                  )}
                </Link>
              </div>
              <div className="flex flex-col items-center gap-2 mt-4 w-full px-2">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="w-full text-center py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      to="/orders"
                      className="w-full text-center py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Order History
                    </Link>
                    <Link
                      to="/favourites"
                      className="w-full text-center py-3 text-base text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-xl"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Favourites
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="w-full text-center py-3 text-base text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        handleLogout();
                      }}
                      className="w-full text-center py-3 text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="w-full text-center py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="w-full text-center py-3 text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 