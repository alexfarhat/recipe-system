import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, InfoIcon, XIcon } from 'lucide-react';
interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: (id: string) => void;
}
export function Toast({ id, message, type, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-herb" />,
    error: <XCircleIcon className="w-5 h-5 text-tomato" />,
    info: <InfoIcon className="w-5 h-5 text-saffron" />
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
        scale: 0.9
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }}
      exit={{
        opacity: 0,
        scale: 0.9
      }}
      className="bg-surface rounded-lg shadow-lg border border-border p-4 flex items-center gap-3 min-w-[300px]">
      
      {icons[type]}
      <p className="flex-1 text-sm text-text-dark">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-text-muted hover:text-text-dark transition-colors">
        
        <XIcon className="w-4 h-4" />
      </button>
    </motion.div>);

}
export function ToastContainer({
  toasts,
  onClose



}: {toasts: ToastProps[];onClose: (id: string) => void;}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) =>
        <Toast key={toast.id} {...toast} onClose={onClose} />
        )}
      </AnimatePresence>
    </div>);

}