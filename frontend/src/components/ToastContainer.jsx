import React from 'react'
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react'

export default function ToastContainer({ toasts, removeToast }) {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} />
      case 'error':
        return <AlertCircle size={18} />
      case 'info':
        return <Info size={18} />
      case 'loading':
        return <Loader2 size={18} className="animate-spin" />
      default:
        return null
    }
  }

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-900 border-l-4 border-green-500'
      case 'error':
        return 'bg-red-50 text-red-900 border-l-4 border-red-500'
      case 'info':
        return 'bg-yellow-50 text-yellow-900 border-l-4 border-yellow-500'
      case 'loading':
        return 'bg-blue-50 text-blue-900 border-l-4 border-blue-500'
      default:
        return 'bg-gray-50 text-gray-900 border-l-4 border-gray-500'
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      case 'info':
        return 'text-yellow-500'
      case 'loading':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="fixed top-6 right-6 z-[9999] space-y-3 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg ${getColors(
            toast.type
          )} animate-slideInRight`}
        >
          <div className={getIconColor(toast.type)}>{getIcon(toast.type)}</div>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          {toast.type !== 'loading' && (
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
