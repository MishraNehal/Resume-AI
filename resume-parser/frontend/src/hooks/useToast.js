import { useState, useCallback } from 'react'

const useToast = () => {
  const [toasts, setToasts] = useState([])

  // ✅ FIX: Declare removeToast FIRST so addToast can reference it in dependency array
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // ✅ FIX: Added removeToast to dependency array so closure always has latest reference
  const addToast = useCallback(
    (type, message, duration = 4000) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, type, message, duration }])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    [removeToast] // ✅ FIX: was [] — missing removeToast caused stale closure
  )

  return { toasts, addToast, removeToast }
}

export default useToast
