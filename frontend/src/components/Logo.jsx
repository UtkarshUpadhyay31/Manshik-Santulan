import React from 'react';
import { motion } from 'framer-motion';
import logoImage from '../assets/logo.png';

export const Logo = ({ className = "w-10 h-10" }) => (
  <motion.img
    src="/mainlogo.jpg"
    alt="Manshik Santulan Logo"
    className={`${className} object-contain`}
    whileHover={{ scale: 1.1, rotate: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
  />
);

export default Logo;
