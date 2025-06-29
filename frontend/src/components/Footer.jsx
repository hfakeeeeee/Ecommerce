import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart, FaFacebook, FaMicrochip } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
  const socialLinks = [
    { icon: <FaFacebook />, href: 'https://www.facebook.com/HFakeee/', label: 'Facebook' },
    { icon: <FaInstagram />, href: 'https://www.instagram.com/hfakeeeeee/', label: 'Instagram' },
    { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/hfake/', label: 'LinkedIn' }
  ];

  const contactInfo = [
    { icon: <FaMapMarkerAlt />, text: 'TMA Solutions Lab 6' },
    { icon: <FaPhone />, text: '+84 902355669' },
    { icon: <FaEnvelope />, text: 'huynguyenquoc.work@gmail.com' }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-4"
            >
              <FaMicrochip className="w-6 h-6 mr-2" />
              TECHVERSE
            </motion.div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Empowering your digital lifestyle with cutting-edge technology. We bring you the future of tech, today.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5 }} className="transition-colors">
                <a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  About Us
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} className="transition-colors">
                <a href="/catalog" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Shop
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} className="transition-colors">
                <a href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Tech Blog
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} className="transition-colors">
                <a href="/support" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Tech Support
                </a>
              </motion.li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <motion.li whileHover={{ x: 5 }} className="transition-colors">
                <a href="/shipping" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Shipping Information
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} className="transition-colors">
                <a href="/warranty" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Warranty & Returns
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} className="transition-colors">
                <a href="/setup-guides" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Setup Guides
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} className="transition-colors">
                <a href="/faq" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  FAQ
                </a>
              </motion.li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h4>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center text-gray-600 dark:text-gray-300"
                >
                  <span className="text-indigo-600 dark:text-indigo-400 mr-3">
                    {info.icon}
                  </span>
                  <span className="text-sm">{info.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -3 }}
                  className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
              Made with <FaHeart className="text-red-500 mx-1" /> by TECHVERSE © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
  