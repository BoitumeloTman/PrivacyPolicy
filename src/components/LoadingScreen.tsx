import React from 'react';
import { motion } from 'framer-motion';
import { GoatLogo } from './GoatLogo';

export const LoadingScreen: React.FC = () => {
  const bounceVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <motion.div
        variants={bounceVariants}
        initial="initial"
        animate="animate"
      >
        <GoatLogo size={120} />
      </motion.div>
      
      <motion.div 
        className="mt-8 text-emerald-500 text-xl font-bold"
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        Loading Bokamoso...
      </motion.div>
      
      <div className="mt-4 flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-3 w-3 bg-emerald-500 rounded-full"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};