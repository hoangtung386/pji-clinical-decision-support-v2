import React, { useEffect, useState } from 'react';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

let toastId = 0;
let addToastFn: ((msg: Omit<ToastMessage, 'id'>) => void) | null = null;

export function showToast(text: string, type: ToastMessage['type'] = 'info') {
  addToastFn?.({ text, type });
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    addToastFn = (msg) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { ...msg, id }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    };
    return () => { addToastFn = null; };
  }, []);

  if (toasts.length === 0) return null;

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${colors[t.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in min-w-[280px]`}
        >
          <span className="material-symbols-outlined text-[20px]">{icons[t.type]}</span>
          <span className="text-sm font-medium">{t.text}</span>
        </div>
      ))}
    </div>
  );
};
