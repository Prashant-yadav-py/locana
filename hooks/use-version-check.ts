"use client"

import { useEffect } from 'react'

export function useVersionCheck() {
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch('/version.json?t=' + Date.now(), {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        const data = await response.json()
        const storedVersion = localStorage.getItem('app-version')
        
        if (storedVersion && storedVersion !== data.version) {
          localStorage.clear()
          sessionStorage.clear()
          if ('caches' in window) {
            caches.keys().then(names => names.forEach(name => caches.delete(name)))
          }
          localStorage.setItem('app-version', data.version)
          window.location.reload(true)
        } else if (!storedVersion) {
          localStorage.setItem('app-version', data.version)
        }
      } catch (error) {
        console.log('Version check failed:', error)
      }
    }

    checkVersion()
    const interval = setInterval(checkVersion, 30000)
    
    return () => clearInterval(interval)
  }, [])
}
