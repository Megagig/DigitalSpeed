'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">DigitalSpeed</h3>
            <p className="text-gray-300 mb-4">
              Transforming ideas into digital reality. I specialize in creating exceptional web experiences with modern technologies.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                <FaGithub size={20} />
              </a>
              <a 
                href="https://linkedin.com/in/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
              <a 
                href="https://twitter.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a 
                href="https://facebook.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                <FaFacebook size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#services" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Me</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FaEnvelope className="text-purple-400 mr-3" />
                <a href="mailto:contact@digitalspeed.com" className="text-gray-300 hover:text-purple-400 transition-colors">
                  contact@digitalspeed.com
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-purple-400 mr-3" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-purple-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} DigitalSpeed. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
