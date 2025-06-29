import { motion } from 'framer-motion';
import { FaShieldAlt, FaUndo, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export default function WarrantyPage() {
  const warrantyPolicies = [
    {
      icon: <FaShieldAlt />,
      title: "Standard Warranty",
      description: "All products come with a minimum 1-year manufacturer warranty",
      details: [
        "Coverage for manufacturing defects",
        "Free repairs or replacements",
        "Technical support included",
        "Extended warranty options available"
      ]
    },
    {
      icon: <FaUndo />,
      title: "Returns Policy",
      description: "30-day money-back guarantee on all purchases",
      details: [
        "Hassle-free returns process",
        "Full refund on unused items",
        "Free return shipping",
        "Quick processing time"
      ]
    }
  ];

  const returnSteps = [
    {
      title: "Initiate Return",
      description: "Log into your account and select the item you wish to return"
    },
    {
      title: "Package Item",
      description: "Carefully pack the item in its original packaging if possible"
    },
    {
      title: "Ship Return",
      description: "Use our prepaid shipping label to send the item back"
    },
    {
      title: "Refund Process",
      description: "Receive your refund within 3-5 business days after we receive the item"
    }
  ];

  const warrantyExclusions = [
    "Physical damage from misuse or accidents",
    "Unauthorized modifications or repairs",
    "Normal wear and tear",
    "Damage from power surges or natural disasters"
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
            Warranty & Returns
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We stand behind our products with comprehensive warranty coverage and a hassle-free returns process.
          </p>
        </motion.div>

        {/* Warranty & Returns Policies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {warrantyPolicies.map((policy, index) => (
            <motion.div
              key={policy.title}
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
                  {policy.icon}
                </motion.div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {policy.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {policy.description}
                </p>
              </div>
              <ul className="space-y-3">
                {policy.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaCheck className="text-green-500 mr-3" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Return Process */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Return Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {returnSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg relative"
              >
                <div className="text-blue-600 dark:text-blue-400 text-2xl font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Warranty Exclusions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8"
        >
          <div className="flex items-center mb-6">
            <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Warranty Exclusions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warrantyExclusions.map((exclusion, index) => (
              <div
                key={index}
                className="flex items-center text-gray-600 dark:text-gray-300"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                {exclusion}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Have questions about our warranty or returns policy?
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