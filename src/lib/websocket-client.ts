'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { GameResult, Statistics } from '@/types/game'

// Use the same origin for WebSocket connections (local Next.js server with integrated Socket.IO)
const BACKEND_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
const isDevelopment = process.env.NODE_ENV === 'development'

// Get the base path for socket.io path configuration
const getSocketPath = () => {
  if (typeof window !== 'undefined') {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    return basePath ? `${basePath}/socket.io/` : '/socket.io/'
  }
  return '/socket.io/'
}

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [globalStats, setGlobalStats] = useState<Statistics>({
    totalGames: 0,
    stayWins: 0,
    switchWins: 0,
    stayTotal: 0,
    switchTotal: 0,
  })
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (isDevelopment) console.log('Connecting to backend:', BACKEND_URL)
    
    const socketInstance = io(BACKEND_URL, {
      path: getSocketPath(),
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      if (isDevelopment) console.log('Connected to backend WebSocket server')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      if (isDevelopment) console.log('Disconnected from backend WebSocket server')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      if (isDevelopment) console.error('WebSocket connection error:', error)
      setIsConnected(false)
    })

    socketInstance.on('stats-update', (stats: Statistics) => {
      if (isDevelopment) console.log('Received stats update:', stats)
      setGlobalStats(stats)
    })

    setSocket(socketInstance)

    // Load initial stats from API
    fetchInitialStats()

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const fetchInitialStats = async () => {
    try {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
      const response = await fetch(`${BACKEND_URL}${basePath}/api/stats`)
      if (response.ok) {
        const stats = await response.json()
        setGlobalStats(stats)
      }
    } catch (error) {
      if (isDevelopment) console.error('Error fetching initial stats:', error)
    }
  }

  const sendGameResult = async (result: GameResult) => {
    try {
      // Send via WebSocket if connected
      if (socket && isConnected) {
        socket.emit('game-result', result)
      } else {
        // Fallback to HTTP API
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
        const response = await fetch(`${BACKEND_URL}${basePath}/api/game-result`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result),
        })
        
        if (response.ok) {
          const data = await response.json()
          setGlobalStats(data.stats)
        }
      }
    } catch (error) {
      if (isDevelopment) console.error('Error sending game result:', error)
    }
  }

  return {
    globalStats,
    isConnected,
    sendGameResult,
  }
}