import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}
          className="fixed inset-0 bg-text-dark/40 backdrop-blur-sm z-40"
          onClick={onClose} />
        
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
            initial={{
              opacity: 0,
              y: 8,
              scale: 0.98
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.98
            }}
            transition={{
              duration: 0.2
            }}
            className={`bg-surface rounded-xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto border border-border`}>
            
              {title &&
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <h2 className="text-xl font-serif font-semibold text-text-dark">
                    {title}
                  </h2>
                  <button
                onClick={onClose}
                className="text-text-muted hover:text-text-dark transition-colors"
                aria-label="Close modal">
                
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
            }
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}