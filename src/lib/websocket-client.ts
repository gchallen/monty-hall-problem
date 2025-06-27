'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { GameResult, Statistics } from '@/types/game'

// Use the same origin for WebSocket connections (local Next.js server with integrated Socket.IO)
const BACKEND_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'

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
    console.log('Connecting to backend:', BACKEND_URL)
    
    const socketInstance = io(BACKEND_URL, {
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      console.log('Connected to backend WebSocket server')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from backend WebSocket server')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      setIsConnected(false)
    })

    socketInstance.on('stats-update', (stats: Statistics) => {
      console.log('Received stats update:', stats)
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
      const response = await fetch(`${BACKEND_URL}/api/stats`)
      if (response.ok) {
        const stats = await response.json()
        setGlobalStats(stats)
      }
    } catch (error) {
      console.error('Error fetching initial stats:', error)
    }
  }

  const sendGameResult = async (result: GameResult) => {
    try {
      // Send via WebSocket if connected
      if (socket && isConnected) {
        socket.emit('game-result', result)
      } else {
        // Fallback to HTTP API
        const response = await fetch(`${BACKEND_URL}/api/game-result`, {
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
      console.error('Error sending game result:', error)
    }
  }

  return {
    globalStats,
    isConnected,
    sendGameResult,
  }
}