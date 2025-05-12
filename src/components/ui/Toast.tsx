'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiCheck, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { cn } from '@/lib/utils';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast interface
export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

// Context interface
interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

// Create context
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Toast provider props
interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

// Toast provider component
export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Mount check for SSR
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Add toast
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000, // Default 5 seconds
    };

    setToasts((prevToasts) => {
      // Limit the number of toasts
      const updatedToasts = [newToast, ...prevToasts].slice(0, maxToasts);
      return updatedToasts;
    });

    return id;
  };

  // Remove toast
  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Remove all toasts
  const removeAllToasts = () => {
    setToasts([]);
  };

  // Position classes
  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, removeAllToasts }}>
      {children}
      {isMounted &&
        createPortal(
          <div
            className={cn(
              'fixed z-50 p-4 w-full sm:max-w-sm flex flex-col gap-2',
              positionClasses[position]
            )}
          >
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

// Toast item component
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        onClose();
        if (toast.onClose) toast.onClose();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  // Icon based on type
  const icons = {
    success: <FiCheck className="w-5 h-5" />,
    error: <FiAlertCircle className="w-5 h-5" />,
    warning: <FiAlertTriangle className="w-5 h-5" />,
    info: <FiInfo className="w-5 h-5" />,
  };

  // Colors based on type
  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  };

  const iconColors = {
    success: 'text-green-500 dark:text-green-400',
    error: 'text-red-500 dark:text-red-400',
    warning: 'text-yellow-500 dark:text-yellow-400',
    info: 'text-blue-500 dark:text-blue-400',
  };

  return (
    <div
      className={cn(
        'rounded-lg border shadow-sm p-4 flex items-start gap-3 animate-slide-in',
        colors[toast.type]
      )}
    >
      <div className={cn('flex-shrink-0', iconColors[toast.type])}>{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{toast.title}</h3>
        )}
        <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{toast.message}</div>
      </div>
      <button
        type="button"
        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        onClick={() => {
          onClose();
          if (toast.onClose) toast.onClose();
        }}
      >
        <span className="sr-only">Close</span>
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
