import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../context/store';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}
    >
      <Icon size={20} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto">
        <X size={18} />
      </button>
    </motion.div>
  );
};

export const Notification = () => {
  const { showNotification, notificationMessage } = useUIStore();

  return (
    <AnimatePresence>
      {showNotification && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            message={notificationMessage}
            onClose={() => useUIStore.setState({ showNotification: false })}
          />
        </div>
      )}
    </AnimatePresence>
  );
};
