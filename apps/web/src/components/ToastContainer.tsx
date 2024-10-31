// components/ToastContainer.tsx
'use client';
import React, { useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { XIcon } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => hideToast(toast.id), 5000) 
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, hideToast]);

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-lg flex items-center justify-between transition-all duration-300 ease-in-out transform opacity-100
            ${toast.type === 'success' ? 'bg-white text-black border border-gray-300' : 
              toast.type === 'error' ? 'bg-red-600 text-white' : 
              toast.type === 'info' ? 'bg-blue-600 text-white' : 
              'bg-black text-white'}
          fade-out`}
        >
          <p>{toast.message}</p>
          <button
            className="ml-4 bg-transparent border-none cursor-pointer"
            onClick={() => hideToast(toast.id)}
          >
            <XIcon className="w-5 h-5 text-current" />
          </button>
        </div>
      ))}
      <style jsx>{`
        .fade-out {
          animation: fadeOut 5s forwards;
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;
