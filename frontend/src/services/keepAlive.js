// Ping backend every 14 minutes to keep it awake
const BACKEND_URL = import.meta.env.VITE_API_BASE

export function startKeepAlive() {
  setInterval(async () => {
    try {
      await fetch(`${BACKEND_URL}/health`)
    } catch (e) {
      // silent fail
    }
  }, 14 * 60 * 1000) // every 14 minutes
}