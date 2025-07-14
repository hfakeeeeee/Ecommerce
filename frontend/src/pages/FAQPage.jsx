import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaShoppingCart, FaShippingFast, FaUndo, FaHeadset, FaSearch, FaQuestionCircle } from 'react-icons/fa';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      icon: <FaShoppingCart className="w-6 h-6" />,
      title: "Orders & Payment",
      color: "from-blue-500 to-blue-600",
      faqs: [
        {
          question: "How can I track my order?",
          answer: "You can track your order by logging into your account and visiting the 'Order History' section. You'll find detailed tracking information and delivery updates there. We also send email notifications with tracking links when your order ships."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All payments are processed securely through our encrypted payment system with industry-standard security protocols."
        },
        {
          question: "Can I modify my order after placing it?",
          answer: "Orders can be modified within 1 hour of placement, provided they haven't entered the processing stage. Please contact our customer support team immediately if you need to make changes. After this window, modifications may not be possible."
        },
        {
          question: "Do you offer price matching?",
          answer: "Yes, we offer price matching on identical products from authorized retailers. Contact our support team with the competitor's price and we'll match it if it meets our price matching criteria."
        }
      ]
    },
    {
      icon: <FaShippingFast className="w-6 h-6" />,
      title: "Shipping & Delivery",
      color: "from-green-500 to-green-600",
      faqs: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-5 business days within the continental US. Express shipping is available for 1-2 business days delivery. International shipping may take 7-14 business days depending on the destination country and customs processing."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can check shipping rates and estimated delivery times during checkout by entering your address."
        },
        {
          question: "Is shipping insurance included?",
          answer: "Yes, all shipments are fully insured against loss or damage during transit at no additional cost to you. We also provide tracking information so you can monitor your package's progress."
        },
        {
          question: "What if my package is damaged during shipping?",
          answer: "If your package arrives damaged, please contact us within 48 hours with photos of the damage. We'll arrange for a replacement or refund immediately and handle all insurance claims on your behalf."
        }
      ]
    },
    {
      icon: <FaUndo className="w-6 h-6" />,
      title: "Returns & Refunds",
      color: "from-purple-500 to-purple-600",
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for most items. Products must be in original condition with all packaging and accessories. Some items like software or personalized products may have specific return restrictions."
        },
        {
          question: "How do I initiate a return?",
          answer: "Log into your account, go to 'Order History', select the item you wish to return, and follow the return instructions. We'll provide a prepaid shipping label for your convenience. The process is completely digital and hassle-free."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 3-5 business days after we receive and inspect the returned item. The funds may take additional 2-3 days to appear in your account depending on your bank or payment method."
        },
        {
          question: "Can I exchange an item instead of returning it?",
          answer: "Yes, we offer exchanges for different sizes, colors, or models of the same product category. The exchange process is similar to returns, and we'll send the replacement item once we receive the original."
        }
      ]
    },
    {
      icon: <FaHeadset className="w-6 h-6" />,
      title: "Technical Support",
      color: "from-orange-500 to-orange-600",
      faqs: [
        {
          question: "How can I get technical support?",
          answer: "Our technical support team is available 24/7 through live chat, email, or phone. You can also check our Setup Guides section for detailed product instructions and troubleshooting tips."
        },
        {
          question: "Do you offer warranty service?",
          answer: "Yes, all our products come with a minimum 1-year manufacturer warranty. Extended warranty options are available for select items. We handle all warranty claims and repairs through our authorized service centers."
        },
        {
          question: "What if my product is defective?",
          answer: "If you receive a defective product, contact us within 48 hours of delivery. We'll arrange for a replacement or repair under warranty coverage. In most cases, we can expedite a replacement to minimize any inconvenience."
        },
        {
          question: "Do you provide setup assistance?",
          answer: "Yes, we offer free setup assistance for complex products. Our technical team can guide you through installation via phone or video call. We also have comprehensive setup guides and video tutorials available online."
        }
      ]
    }
  ];

  // Filter FAQs based on search term
  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const FAQItem = ({ question, answer, isOpen, onClick, categoryIndex, faqIndex }) => (
    <motion.div
      initial={false}
      className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
    >
      <button
        className="w-full py-6 flex justify-between items-start text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className="text-gray-800 dark:text-gray-200 font-semibold pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {question}
        </span>
        <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FaChevronDown />
          </motion.div>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

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
            <FaQuestionCircle className="w-12 h-12 text-blue-600" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 break-words whitespace-pre-line">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our products, services, and policies.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search frequently asked questions..."
              className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 shadow-lg"
            />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {category.faqs.map((faq, faqIndex) => (
                  <FAQItem
                    key={faqIndex}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === `${categoryIndex}-${faqIndex}`}
                    onClick={() => setOpenIndex(openIndex === `${categoryIndex}-${faqIndex}` ? null : `${categoryIndex}-${faqIndex}`)}
                    categoryIndex={categoryIndex}
                    faqIndex={faqIndex}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {searchTerm && filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FaQuestionCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try searching with different keywords or browse our categories above.
            </p>
          </motion.div>
        )}

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help you 24/7.
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