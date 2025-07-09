import { motion, useScroll, useTransform } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  FaArrowRight, 
  FaMicrochip, 
  FaShieldAlt, 
  FaShippingFast, 
  FaHeadset, 
  FaLaptop, 
  FaMobile, 
  FaHeadphones,
  FaRocket,
  FaBolt,
  FaGlobe,
  FaCog,
  FaCode,
  FaWifi,
  FaDatabase,
  FaCloud,
  FaShoppingCart,
  FaTruck,
  FaCreditCard,
  FaUsers,
  FaStar,
  FaFire,
  FaGem
} from 'react-icons/fa'
import BackToTop from '../components/BackToTop'

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 50])
  const y2 = useTransform(scrollY, [0, 300], [0, -25])
  const navigate = useNavigate()

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  const handleCategoryClick = (categoryId) => {
    navigate(`/catalog?category=${categoryId}`)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const categories = [
    {
      id: 'laptops',
      name: 'Laptops',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      description: 'High-performance laptops for professionals',
      icon: <FaLaptop className="w-8 h-8" />,
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'smartphones',
      name: 'Smartphones',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      description: 'Latest smartphones with premium features',
      icon: <FaMobile className="w-8 h-8" />,
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 'audio',
      name: 'Audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      description: 'Premium audio equipment and accessories',
      icon: <FaHeadphones className="w-8 h-8" />,
      gradient: 'from-green-600 to-teal-600'
    }
  ]

  const features = [
    {
      icon: <FaGem className="w-8 h-8" />,
      title: 'Premium Products',
      description: 'Curated selection of the latest technology products from top brands',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: 'Fast Delivery',
      description: 'Free shipping worldwide with express delivery options available',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: 'Secure Shopping',
      description: 'Protected transactions with industry-leading security protocols',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: <FaCreditCard className="w-8 h-8" />,
      title: 'Easy Payments',
      description: 'Multiple payment options with secure checkout and buyer protection',
      gradient: 'from-purple-500 to-indigo-500'
    }
  ]

  const techStats = [
    { number: '50K+', label: 'Products Sold', icon: <FaShoppingCart /> },
    { number: '99.9%', label: 'Customer Satisfaction', icon: <FaStar /> },
    { number: '24/7', label: 'Customer Support', icon: <FaHeadset /> },
    { number: '150+', label: 'Countries Served', icon: <FaGlobe /> }
  ]

  const floatingIcons = [
    { icon: <FaMicrochip />, delay: 0 },
    { icon: <FaWifi />, delay: 1 },
    { icon: <FaDatabase />, delay: 2 },
    { icon: <FaCode />, delay: 3 },
    { icon: <FaCloud />, delay: 4 },
    { icon: <FaCog />, delay: 5 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden">
      <BackToTop />
      {/* Simplified Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Tech Icons - Reduced and Simplified */}
        {floatingIcons.slice(0, 4).map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-blue-400/5 text-4xl"
            style={{
              left: `${15 + (index * 20)}%`,
              top: `${25 + (index * 15)}%`,
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut"
            }}
          >
            {item.icon}
          </motion.div>
        ))}

        {/* Simplified Gradient Orbs */}
        <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl top-1/4 left-1/4" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Tech Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-8"
            >
              <FaShoppingCart className="w-4 h-4" />
              Premium Technology Marketplace
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            </motion.div>

            {/* Main Heading with Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex items-center justify-center gap-6 mb-6"
            >
              <FaRocket className="text-blue-400 text-4xl md:text-6xl" />
              <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-300 tracking-tight">
                TECHVERSE
              </h1>
              <FaBolt className="text-yellow-400 text-4xl md:text-6xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-2xl md:text-4xl font-light text-blue-100 mb-4"
            >
              Your Ultimate Tech
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold flex items-center justify-center gap-3 mt-2">
                <FaFire className="text-orange-400" />
                Shopping Destination
                <FaGem className="text-purple-400" />
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Discover premium technology products from leading brands. Shop laptops, smartphones, 
              audio equipment, and cutting-edge gadgets with confidence and convenience.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex justify-center"
            >
              <Link
                to="/catalog"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-3">
                  <FaShoppingCart className="w-5 h-5" />
                  Shop Now
                  <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Simplified Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-blue-400/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-blue-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <FaStar className="text-yellow-400 text-3xl" />
              <h2 className="text-3xl font-bold text-white">Our Achievements</h2>
              <FaStar className="text-yellow-400 text-3xl" />
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {techStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white text-2xl mb-4 shadow-lg"
                >
                  {stat.icon}
                </motion.div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-24">
        <motion.div style={{ y: y1 }} className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-3 mb-6"
            >
              <FaShoppingCart className="text-blue-400 text-4xl" />
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                Shop by Category
              </h2>
              <FaGem className="text-purple-400 text-4xl" />
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Browse our extensive collection of premium technology products
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl cursor-pointer"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                  <motion.img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Floating Icon */}
                  <motion.div
                    className={`absolute top-6 right-6 w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg z-20`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {category.icon}
                  </motion.div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <h3 className="text-3xl font-bold text-white mb-3">
                      {category.name}
                    </h3>
                    <p className="text-gray-200 text-lg mb-4">
                      {category.description}
                    </p>
                    <div className="inline-flex items-center text-blue-300 font-semibold group-hover:text-blue-200 transition-colors">
                      Shop Now
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-gradient-to-b from-transparent to-black/30">
        <motion.div style={{ y: y2 }} className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-indigo-900/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-3 mb-6"
            >
              <FaShieldAlt className="text-green-400 text-4xl" />
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                Why Shop with TECHVERSE
              </h2>
              <FaTruck className="text-yellow-400 text-4xl" />
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Experience premium shopping with unmatched service and quality assurance
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative p-8 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-3xl border border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl text-white mb-6 shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-24 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-8"
          >
            <FaBolt className="w-4 h-4" />
            Exclusive Deals & Updates
          </motion.div>

          <div className="inline-flex items-center gap-4 mb-6">
            <FaFire className="text-orange-400 text-4xl" />
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              Stay Ahead of Tech Trends
            </h2>
            <FaRocket className="text-blue-400 text-4xl" />
          </div>

          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Subscribe to get exclusive deals, new product launches, and tech insights delivered to your inbox. 
            Be the first to shop the latest technology.
          </p>
          
          <motion.form
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      </section>
    </div>
  )
}