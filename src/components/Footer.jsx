
import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-slate-800/30 py-8 text-center text-gray-400"
    >
      <div className="container mx-auto px-4">
        <p className="mb-4">&copy; {new Date().getFullYear()} JobFinder. Всі права захищено.</p>
        <div className="flex justify-center space-x-4">
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <Github size={24} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <Linkedin size={24} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <Twitter size={24} />
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
