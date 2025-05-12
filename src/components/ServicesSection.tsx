'use client';

import { FaLaptopCode, FaMobileAlt, FaSearch, FaPenNib } from 'react-icons/fa';

const services = [
  {
    id: 1,
    title: 'Web Development',
    description: 'Building responsive, fast, and user-friendly websites and web applications using modern technologies like React, Next.js, and TypeScript.',
    icon: <FaLaptopCode className="text-4xl text-purple-600 dark:text-purple-400" />,
  },
  {
    id: 2,
    title: 'Mobile Development',
    description: 'Creating cross-platform mobile applications with React Native that provide native-like experiences on both iOS and Android devices.',
    icon: <FaMobileAlt className="text-4xl text-purple-600 dark:text-purple-400" />,
  },
  {
    id: 3,
    title: 'Digital Marketing (SEO)',
    description: 'Optimizing websites for search engines to increase visibility, drive organic traffic, and improve conversion rates through data-driven strategies.',
    icon: <FaSearch className="text-4xl text-purple-600 dark:text-purple-400" />,
  },
  {
    id: 4,
    title: 'Content Creation',
    description: 'Producing engaging, informative, and SEO-friendly content that resonates with your target audience and helps establish your brand as an authority.',
    icon: <FaPenNib className="text-4xl text-purple-600 dark:text-purple-400" />,
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Services
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            I offer a comprehensive range of digital services to help businesses and individuals establish a strong online presence and achieve their goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
