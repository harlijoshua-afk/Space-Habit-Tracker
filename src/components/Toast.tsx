/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 w-full max-w-xs px-4 pointer-events-none flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-xl border backdrop-blur-md shadow-2xl ${
                toast.type === 'success'
                  ? 'bg-primary-container/20 border-primary/50 text-white'
                  : toast.type === 'warning'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                  : 'bg-surface-container-high/45 border-outline-variant/30 text-sky-200'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-primary" />}
                {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
              </div>

              <div className="flex-grow">
                <p className="text-xs font-mono font-medium leading-relaxed">
                  {toast.text}
                </p>
              </div>

              <button
                style={{ minWidth: '24px', minHeight: '24px' }}
                onClick={() => onDismiss(toast.id)}
                className="flex-shrink-0 p-0.5 text-on-surface-variant/50 hover:text-white transition-all rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
