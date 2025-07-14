import { motion } from 'framer-motion';
import { FaShippingFast, FaGlobe, FaBox, FaClock, FaTruck, FaPlane, FaShip, FaMapMarkerAlt } from 'react-icons/fa';

export default function ShippingPage() {
  const shippingMethods = [
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Standard Shipping", 
      description: "3-5 business days",
      price: "Free for orders over $50",
      features: ["Tracking included", "Insurance covered", "Signature required"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaPlane className="w-8 h-8" />,
      title: "Express Shipping",
      description: "1-2 business days", 
      price: "$15.99",
      features: ["Priority handling", "Real-time tracking", "Guaranteed delivery"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaShip className="w-8 h-8" />,
      title: "International Shipping",
      description: "7-14 business days",
      price: "Calculated at checkout",
      features: ["Customs handling", "Door-to-door service", "Multi-language support"],
      color: "from-purple-500 to-purple-600"
    }
  ];

  const policies = [
    {
      icon: <FaShippingFast className="w-6 h-6" />,
      title: "Free Shipping",
      description: "Orders over $50 qualify for free standard shipping to most locations"
    },
    {
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      title: "Order Tracking",
      description: "Track your order status in real-time through your account dashboard"
    },
    {
      icon: <FaBox className="w-6 h-6" />,
      title: "Secure Packaging",
      description: "All shipments are carefully packaged and fully insured against loss or damage"
    },
    {
      icon: <FaGlobe className="w-6 h-6" />,
      title: "Global Delivery",
      description: "We ship to over 150 countries worldwide with reliable delivery partners"
    }
  ];

  const deliverySteps = [
    {
      step: "1",
      title: "Order Confirmed",
      description: "Your order is confirmed and payment processed"
    },
    {
      step: "2", 
      title: "Processing",
      description: "Items are picked, packed, and prepared for shipment"
    },
    {
      step: "3",
      title: "In Transit",
      description: "Your package is on its way with real-time tracking"
    },
    {
      step: "4",
      title: "Delivered",
      description: "Package arrives safely at your doorstep"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <FaTruck className="w-12 h-12 text-blue-600" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 break-words whitespace-pre-line">
              Shipping Information
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Fast and reliable shipping options to get your tech products delivered safely to your doorstep.
          </p>
        </motion.div>

        {/* Shipping Methods */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
          >
            Shipping Options
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="text-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${method.color} text-white mb-6 shadow-lg`}
                  >
                    {method.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {method.description}
                  </p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {method.price}
                  </p>
                </div>
                <ul className="space-y-3">
                  {method.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Delivery Process */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
          >
            Delivery Process
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {deliverySteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center relative"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg">
                    {step.step}
                  </div>
                  {index < deliverySteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30"></div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Shipping Policies */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
          >
            Shipping Policies
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    {policy.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {policy.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {policy.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Need Shipping Help?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Our customer service team is available 24/7 to assist you with any shipping-related questions.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300"
            >
              <FaShippingFast />
              Contact Shipping Support
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}