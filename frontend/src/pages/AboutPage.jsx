import { motion } from 'framer-motion';
import { FaCode, FaLightbulb, FaRobot, FaGithub, FaLinkedin, FaTwitter, FaMicrochip } from 'react-icons/fa';

export default function AboutPage() {
  const values = [
    {
      icon: <FaCode className="w-8 h-8" />,
      title: "Innovation",
      description: "Pushing the boundaries of technology to create cutting-edge solutions."
    },
    {
      icon: <FaLightbulb className="w-8 h-8" />,
      title: "Quality",
      description: "Delivering premium tech products with exceptional performance."
    },
    {
      icon: <FaRobot className="w-8 h-8" />,
      title: "Future-Ready",
      description: "Embracing emerging technologies to shape tomorrow's world."
    }
  ];

  const teamMembers = [
    {
      name: "HFake",
      role: "Founder & CEO",
      image: "https://iili.io/FYnEPl2.png",
      bio: "Visionary leader with a passion for technology and innovation. Driving the future of tech retail.",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    },
    {
      name: "Cursor",
      role: "Chief Technology Officer",
      image: "https://images.prismic.io/sacra/Z0Sul68jQArT1Sb7_cursorlogo.png?w=500",
      bio: "Expert in AI and development tools. Leading the technical innovation at TECHVERSE.",
      social: {
        github: "https://github.com/cursor-ai",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    },
    {
      name: "ChatGPT",
      role: "AI Solutions Architect",
      image: "https://fs.enterprisedna.co/tools/cover-images/0UwHydDM1WIri1i4vrMSCJQw5phKSDv4rEaBz3WI.webp?w=500",
      bio: "Pioneering AI integration in e-commerce. Making technology more accessible and intuitive.",
      social: {
        github: "https://github.com/openai",
        linkedin: "https://linkedin.com/company/openai",
        twitter: "https://twitter.com/openai"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600"
            alt="About Hero"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center mb-6">
              <FaMicrochip className="w-12 h-12 text-blue-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              About TECHVERSE
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              We're revolutionizing the tech retail experience by bringing you the latest and most innovative technology products with unparalleled service and expertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-6"
                >
                  {value.icon}
                </motion.div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group h-full"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 h-full flex flex-col">
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="p-6 text-center flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                        {member.role}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {member.bio}
                      </p>
                    </div>
                    <div className="flex justify-center space-x-6">
                      <motion.a
                        whileHover={{ scale: 1.2 }}
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <FaGithub className="w-6 h-6" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.2 }}
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <FaLinkedin className="w-6 h-6" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.2 }}
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <FaTwitter className="w-6 h-6" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 