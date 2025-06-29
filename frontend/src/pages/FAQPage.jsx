import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaShoppingCart, FaShippingFast, FaUndo, FaHeadset } from 'react-icons/fa';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    {
      icon: <FaShoppingCart />,
      title: "Orders & Payment",
      faqs: [
        {
          question: "How can I track my order?",
          answer: "You can track your order by logging into your account and visiting the 'Order History' section. You'll find detailed tracking information and delivery updates there."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through our encrypted payment system."
        },
        {
          question: "Can I modify my order after placing it?",
          answer: "Orders can be modified within 1 hour of placement. Please contact our customer support team immediately if you need to make changes."
        }
      ]
    },
    {
      icon: <FaShippingFast />,
      title: "Shipping & Delivery",
      faqs: [
        {
          question: "How long does shipping take?",
          answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days delivery. International shipping may take 7-14 business days."
        },
        {
          question: "Do you ship internationally?",
          answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can check shipping rates during checkout."
        },
        {
          question: "Is shipping insurance included?",
          answer: "Yes, all shipments are fully insured against loss or damage during transit at no additional cost to you."
        }
      ]
    },
    {
      icon: <FaUndo />,
      title: "Returns & Refunds",
      faqs: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy for most items. Products must be in original condition with all packaging and accessories. Some items may have specific return restrictions."
        },
        {
          question: "How do I initiate a return?",
          answer: "Log into your account, go to 'Order History', select the item you wish to return, and follow the return instructions. We'll provide a prepaid shipping label for your convenience."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 3-5 business days after we receive and inspect the returned item. The funds may take additional days to appear in your account depending on your bank."
        }
      ]
    },
    {
      icon: <FaHeadset />,
      title: "Technical Support",
      faqs: [
        {
          question: "How can I get technical support?",
          answer: "Our technical support team is available 24/7 through live chat, email, or phone. You can also check our Setup Guides section for detailed product instructions."
        },
        {
          question: "Do you offer warranty service?",
          answer: "Yes, all our products come with a minimum 1-year manufacturer warranty. Extended warranty options are available for select items."
        },
        {
          question: "What if my product is defective?",
          answer: "If you receive a defective product, contact us within 48 hours of delivery. We'll arrange for a replacement or repair under warranty coverage."
        }
      ]
    }
  ];

  const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <motion.div
      initial={false}
      className="border-b border-gray-200 dark:border-gray-700"
    >
      <button
        className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
        onClick={onClick}
      >
        <span className="text-gray-800 dark:text-gray-200 font-medium">
          {question}
        </span>
        <span className="ml-6 text-blue-600 dark:text-blue-400">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pb-4 text-gray-600 dark:text-gray-300">
          {answer}
        </div>
      </motion.div>
    </motion.div>
  );

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
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about our products, services, and policies.
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="text-blue-600 dark:text-blue-400 text-2xl mr-4">
                    {category.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
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
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Can't find the answer you're looking for?
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