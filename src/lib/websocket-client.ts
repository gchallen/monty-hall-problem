'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { GameResult, Statistics } from '@/types/game'

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
    // Only try to connect WebSocket in development
    if (process.env.NODE_ENV === 'development') {
      try {
        const socketInstance = io('http://localhost:3000')

        socketInstance.on('connect', () => {
          console.log('Connected to WebSocket server')
          setIsConnected(true)
        })

        socketInstance.on('disconnect', () => {
          console.log('Disconnected from WebSocket server')
          setIsConnected(false)
        })

        socketInstance.on('stats-update', (stats: Statistics) => {
          setGlobalStats(stats)
        })

        setSocket(socketInstance)

        return () => {
          socketInstance.disconnect()
        }
      } catch (error) {
        console.log('WebSocket not available, using local stats only')
      }
    } else {
      console.log('WebSocket disabled in production, using local stats only')
    }
  }, [])

  const sendGameResult = (result: GameResult) => {
    if (socket && isConnected) {
      socket.emit('game-result', result)
    }
  }

  return {
    globalStats,
    isConnected,
    sendGameResult,
  }
}