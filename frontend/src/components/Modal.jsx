import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass-card p-8 bg-white shadow-2xl border border-white/50"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;
