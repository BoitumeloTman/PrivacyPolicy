import React from 'react';
import { motion } from 'framer-motion';

interface GoatLogoProps {
  size?: number;
  className?: string;
}

export const GoatLogo: React.FC<GoatLogoProps> = ({ size = 40, className = '' }) => {
  // Animation variants
  const headVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: [0, -5, 0, 5, 0],
      transition: { 
        repeat: Infinity,
        repeatType: "reverse",
        duration: 4
      }
    }
  };
  
  const earVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -2, 0],
      transition: { 
        repeat: Infinity,
        repeatType: "reverse",
        duration: 2,
        delay: 0.5
      }
    }
  };
  
  const tailVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: [0, 10, 0, -10, 0],
      transition: { 
        repeat: Infinity,
        duration: 2
      }
    }
  };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial="initial"
      animate="animate"
    >
      {/* Body */}
      <motion.path
        d="M70,60 Q85,60 85,50 Q85,30 65,35 Q55,15 35,25 Q25,30 30,45 Q20,50 25,60 Q35,70 50,65 Q65,70 70,60 Z"
        fill="#50C878"
        stroke="#333"
        strokeWidth="2"
      />
      
      {/* Head */}
      <motion.g
        variants={headVariants}
        transformOrigin="45 40"
      >
        <ellipse cx="30" cy="40" rx="12" ry="10" fill="#50C878" stroke="#333" strokeWidth="2" />
        <circle cx="26" cy="38" r="2" fill="#333" /> {/* Eye */}
        
        {/* Horns */}
        <motion.path
          d="M24,34 Q20,25 25,20"
          fill="none"
          stroke="#DDD"
          strokeWidth="3"
          strokeLinecap="round"
          variants={earVariants}
        />
        <motion.path
          d="M34,34 Q38,25 35,20"
          fill="none"
          stroke="#DDD"
          strokeWidth="3"
          strokeLinecap="round"
          variants={earVariants}
        />
      </motion.g>
      
      {/* Legs */}
      <line x1="40" y1="65" x2="40" y2="80" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="65" x2="60" y2="80" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="63" x2="35" y2="78" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      <line x1="65" y1="63" x2="65" y2="78" stroke="#333" strokeWidth="3" strokeLinecap="round" />
      
      {/* Tail */}
      <motion.path
        d="M78,50 Q85,45 83,40"
        fill="none"
        stroke="#333"
        strokeWidth="2"
        strokeLinecap="round"
        variants={tailVariants}
        transformOrigin="78 50"
      />
    </motion.svg>
  );
};