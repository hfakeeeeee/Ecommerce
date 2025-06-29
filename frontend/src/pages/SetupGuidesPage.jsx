import { motion } from 'framer-motion';
import { FaLaptop, FaMobile, FaHeadphones, FaHome, FaGamepad, FaDownload, FaVideo, FaBook } from 'react-icons/fa';

export default function SetupGuidesPage() {
  const categories = [
    {
      icon: <FaLaptop />,
      title: "Laptops & Computers",
      guides: [
        "Initial Setup Guide",
        "Software Installation",
        "Performance Optimization",
        "Troubleshooting Common Issues"
      ]
    },
    {
      icon: <FaMobile />,
      title: "Smartphones & Tablets",
      guides: [
        "Device Activation",
        "Data Transfer Guide",
        "Security Setup",
        "App Management"
      ]
    },
    {
      icon: <FaHeadphones />,
      title: "Audio Devices",
      guides: [
        "Bluetooth Pairing",
        "Sound Optimization",
        "Firmware Updates",
        "Noise Cancellation Setup"
      ]
    },
    {
      icon: <FaHome />,
      title: "Smart Home",
      guides: [
        "Device Connection",
        "App Configuration",
        "Voice Control Setup",
        "Automation Rules"
      ]
    }
  ];

  const popularGuides = [
    {
      icon: <FaDownload />,
      title: "Quick Start Guides",
      description: "Get started with your new device in minutes"
    },
    {
      icon: <FaVideo />,
      title: "Video Tutorials",
      description: "Step-by-step visual guides for setup and usage"
    },
    {
      icon: <FaBook />,
      title: "User Manuals",
      description: "Detailed documentation for all products"
    },
    {
      icon: <FaGamepad />,
      title: "Gaming Setup",
      description: "Optimize your gaming devices for best performance"
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
            Setup Guides
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive setup and installation guides to help you get the most out of your tech products.
          </p>
        </motion.div>

        {/* Popular Guides */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Popular Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {popularGuides.map((guide, index) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
              >
                <div className="text-blue-600 dark:text-blue-400 text-3xl mb-4">
                  {guide.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {guide.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {guide.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Setup Guides by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                >
                  {category.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {category.description}
                </p>
              </div>
              <ul className="space-y-4">
                {category.guides.map((guide, idx) => (
                  <motion.li
                    key={idx}
                    whileHover={{ x: 5 }}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-3"></span>
                    {guide}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Need Additional Help?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our technical support team is available 24/7 to assist you with any setup or installation questions.
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