import { motion } from 'framer-motion';
import { FaShippingFast, FaGlobe, FaBox, FaClock } from 'react-icons/fa';

export default function ShippingPage() {
  const shippingMethods = [
    {
      icon: <FaShippingFast />,
      title: "Standard Shipping",
      description: "3-5 business days",
      price: "Free for orders over $50"
    },
    {
      icon: <FaClock />,
      title: "Express Shipping",
      description: "1-2 business days",
      price: "$15.99"
    },
    {
      icon: <FaGlobe />,
      title: "International Shipping",
      description: "7-14 business days",
      price: "Calculated at checkout"
    }
  ];

  const policies = [
    {
      title: "Free Shipping",
      description: "Orders over $50 qualify for free standard shipping"
    },
    {
      title: "Order Tracking",
      description: "Track your order status in real-time through your account"
    },
    {
      title: "Insurance",
      description: "All shipments are fully insured against loss or damage"
    },
    {
      title: "Multiple Addresses",
      description: "Ship to multiple addresses in a single order"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shipping Information
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Fast and reliable shipping options to get your tech products delivered safely to your doorstep.
          </p>
        </motion.div>

        {/* Shipping Methods */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Shipping Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shippingMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  >
                    {method.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {method.description}
                  </p>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                  {method.price}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Shipping Policies */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Shipping Policies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {policy.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {policy.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Need Help?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our customer service team is available 24/7 to assist you with any shipping-related questions.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
} 