import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-[999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start gap-3 bg-white ${
              toast.type === 'success'
                ? 'border-emerald-200 text-emerald-900'
                : toast.type === 'error'
                ? 'border-rose-200 text-rose-900'
                : toast.type === 'warning'
                ? 'border-amber-200 text-amber-900'
                : 'border-blue-200 text-blue-900'
            }`}
          >
            <span
              className={`material-symbols-outlined shrink-0 text-xl ${
                toast.type === 'success'
                  ? 'text-emerald-600'
                  : toast.type === 'error'
                  ? 'text-rose-600'
                  : toast.type === 'warning'
                  ? 'text-amber-600'
                  : 'text-blue-600'
              }`}
            >
              {toast.type === 'success'
                ? 'check_circle'
                : toast.type === 'error'
                ? 'error'
                : toast.type === 'warning'
                ? 'warning'
                : 'info'}
            </span>
            <div className="flex-1 text-sm">
              <p className="font-semibold">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-slate-600 mt-0.5">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
