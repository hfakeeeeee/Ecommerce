import { motion } from 'framer-motion';
import { FaShieldAlt, FaUndo, FaCheck, FaExclamationTriangle, FaClock, FaTools, FaHeadset, FaFileAlt } from 'react-icons/fa';

export default function WarrantyPage() {
  const warrantyPolicies = [
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Standard Warranty",
      description: "All products come with a minimum 1-year manufacturer warranty",
      details: [
        "Coverage for manufacturing defects",
        "Free repairs or replacements",
        "Technical support included",
        "Extended warranty options available"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaUndo className="w-8 h-8" />,
      title: "Returns Policy", 
      description: "30-day money-back guarantee on all purchases",
      details: [
        "Hassle-free returns process",
        "Full refund on unused items",
        "Free return shipping",
        "Quick processing time"
      ],
      color: "from-green-500 to-green-600"
    }
  ];

  const returnSteps = [
    {
      step: "1",
      title: "Initiate Return",
      description: "Log into your account and select the item you wish to return",
      icon: <FaFileAlt className="w-6 h-6" />
    },
    {
      step: "2",
      title: "Package Item",
      description: "Carefully pack the item in its original packaging if possible",
      icon: <FaUndo className="w-6 h-6" />
    },
    {
      step: "3",
      title: "Ship Return",
      description: "Use our prepaid shipping label to send the item back",
      icon: <FaShieldAlt className="w-6 h-6" />
    },
    {
      step: "4",
      title: "Refund Process",
      description: "Receive your refund within 3-5 business days after we receive the item",
      icon: <FaCheck className="w-6 h-6" />
    }
  ];

  const warrantyTypes = [
    {
      icon: <FaTools className="w-6 h-6" />,
      title: "Hardware Protection",
      description: "Complete coverage for all hardware components and manufacturing defects",
      duration: "1-3 Years"
    },
    {
      icon: <FaHeadset className="w-6 h-6" />,
      title: "Technical Support",
      description: "24/7 technical assistance and troubleshooting guidance",
      duration: "Lifetime"
    },
    {
      icon: <FaClock className="w-6 h-6" />,
      title: "Extended Coverage",
      description: "Optional extended warranty plans for additional peace of mind",
      duration: "Up to 5 Years"
    }
  ];

  const warrantyExclusions = [
    "Physical damage from misuse or accidents",
    "Unauthorized modifications or repairs",
    "Normal wear and tear over time",
    "Damage from power surges or natural disasters",
    "Software issues not related to hardware",
    "Cosmetic damage that doesn't affect functionality"
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
            <FaShieldAlt className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400">
              Warranty & Returns
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We stand behind our products with comprehensive warranty coverage and a hassle-free returns process.
          </p>
        </motion.div>

        {/* Warranty & Returns Policies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {warrantyPolicies.map((policy, index) => (
            <motion.div
              key={policy.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="text-center mb-8">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${policy.color} text-white mb-6 shadow-lg`}
                >
                  {policy.icon}
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {policy.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {policy.description}
                </p>
              </div>
              <ul className="space-y-4">
                {policy.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300">
                    <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Warranty Types */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
          >
            Warranty Coverage Types
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {warrantyTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {type.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {type.description}
                </p>
                <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                  {type.duration}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Return Process */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center"
          >
            Easy Return Process
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {returnSteps.map((step, index) => (
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
                  {index < returnSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30"></div>
                  )}
                </div>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4">
                  {step.icon}
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

        {/* Warranty Exclusions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="bg-red-50 dark:bg-red-900/20 rounded-3xl p-8 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3 mb-6">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Warranty Exclusions
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please note that the following items are not covered under our standard warranty:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warrantyExclusions.map((exclusion, index) => (
                <div
                  key={index}
                  className="flex items-center text-gray-600 dark:text-gray-300"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span>{exclusion}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Questions About Warranty?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Have questions about our warranty or returns policy? Our support team is here to help.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300"
            >
              <FaHeadset />
              Contact Support
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}