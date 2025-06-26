'use client'

import { useEffect, useState } from 'react'
import { GameResult, Statistics } from '@/types/game'

export function useWebSocket() {
  const [globalStats, setGlobalStats] = useState<Statistics>({
    totalGames: 0,
    stayWins: 0,
    switchWins: 0,
    stayTotal: 0,
    switchTotal: 0,
  })
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // WebSocket functionality is disabled for Vercel deployment
    // In a production environment with WebSocket support, you could:
    // 1. Use a separate WebSocket server (like Socket.io on a different service)
    // 2. Use Server-Sent Events with API routes
    // 3. Use a real-time database like Firebase or Supabase
    console.log('WebSocket disabled - using local statistics only')
  }, [])

  const sendGameResult = (result: GameResult) => {
    // In production, you could send this to an API route instead
    // For now, we just aggregate local stats
    setGlobalStats(prevStats => {
      const newStats = { ...prevStats }
      newStats.totalGames += 1
      
      if (result.strategy === 'stay') {
        newStats.stayTotal += 1
        if (result.won) newStats.stayWins += 1
      } else {
        newStats.switchTotal += 1
        if (result.won) newStats.switchWins += 1
      }
      
      return newStats
    })
  }

  return {
    globalStats,
    isConnected,
    sendGameResult,
  }
}