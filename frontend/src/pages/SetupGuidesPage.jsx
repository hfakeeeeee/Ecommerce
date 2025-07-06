import { motion } from 'framer-motion';
import { FaLaptop, FaMobile, FaHeadphones, FaHome, FaGamepad, FaDownload, FaVideo, FaBook, FaPlay, FaFileAlt, FaTools, FaWifi } from 'react-icons/fa';

export default function SetupGuidesPage() {
  const categories = [
    {
      icon: <FaLaptop className="w-8 h-8" />,
      title: "Laptops & Computers",
      description: "Complete setup guides for all computer systems",
      guides: [
        "Initial Setup & Configuration",
        "Software Installation Guide", 
        "Performance Optimization Tips",
        "Troubleshooting Common Issues"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaMobile className="w-8 h-8" />,
      title: "Smartphones & Tablets",
      description: "Mobile device setup and configuration",
      guides: [
        "Device Activation Process",
        "Data Transfer & Migration",
        "Security & Privacy Setup",
        "App Management & Organization"
      ],
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaHeadphones className="w-8 h-8" />,
      title: "Audio Devices",
      description: "Audio equipment setup and optimization",
      guides: [
        "Bluetooth Pairing Guide",
        "Sound Quality Optimization",
        "Firmware Update Process",
        "Noise Cancellation Setup"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <FaHome className="w-8 h-8" />,
      title: "Smart Home Devices",
      description: "IoT and smart home integration",
      guides: [
        "Device Connection & Setup",
        "App Configuration Guide",
        "Voice Control Integration",
        "Automation & Smart Rules"
      ],
      color: "from-orange-500 to-orange-600"
    }
  ];

  const popularGuides = [
    {
      icon: <FaPlay className="w-8 h-8" />,
      title: "Quick Start Videos",
      description: "Get started with your new device in minutes with our video tutorials",
      type: "Video",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <FaFileAlt className="w-8 h-8" />,
      title: "PDF Manuals",
      description: "Detailed documentation and user manuals for all products",
      type: "Document",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaTools className="w-8 h-8" />,
      title: "Setup Tools",
      description: "Interactive setup wizards and configuration utilities",
      type: "Software",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaWifi className="w-8 h-8" />,
      title: "Network Setup",
      description: "Complete guides for network and connectivity configuration",
      type: "Guide",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const setupSteps = [
    {
      step: "1",
      title: "Unbox & Inspect",
      description: "Carefully unpack your device and check all included components"
    },
    {
      step: "2", 
      title: "Initial Setup",
      description: "Follow the quick start guide for basic configuration"
    },
    {
      step: "3",
      title: "Software Install",
      description: "Download and install necessary drivers and software"
    },
    {
      step: "4",
      title: "Customize",
      description: "Personalize settings and optimize for your needs"
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
            <FaTools className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400">
              Setup Guides
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Comprehensive setup and installation guides to help you get the most out of your tech products.
          </p>
        </motion.div>

        {/* Popular Resources */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
          >
            Popular Resources
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularGuides.map((guide, index) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-center border border-gray-200/50 dark:border-gray-700/50 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${guide.color} text-white mb-4 shadow-lg`}
                >
                  {guide.icon}
                </motion.div>
                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-semibold mb-3">
                  {guide.type}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {guide.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {guide.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Setup Process */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
          >
            General Setup Process
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {setupSteps.map((step, index) => (
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
                  {index < setupSteps.length - 1 && (
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

        {/* Setup Guides by Category */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
          >
            Setup Guides by Category
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}
                  >
                    {category.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {category.guides.map((guide, idx) => (
                    <motion.li
                      key={idx}
                      whileHover={{ x: 5 }}
                      className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                      <span>{guide}</span>
                    </motion.li>
                  ))}
                </ul>
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
            <h2 className="text-3xl font-bold mb-4">Need Additional Help?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our technical support team is available 24/7 to assist you with any setup or installation questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300"
              >
                <FaTools />
                Contact Tech Support
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300"
              >
                <FaVideo />
                Watch Tutorials
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}