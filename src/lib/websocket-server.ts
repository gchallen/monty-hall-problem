import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { GameResult, Statistics } from '@/types/game'

let io: SocketIOServer | null = null
let globalStats: Statistics = {
  totalGames: 0,
  stayWins: 0,
  switchWins: 0,
  stayTotal: 0,
  switchTotal: 0,
}

export function initializeWebSocketServer(server: HTTPServer) {
  if (io) return io

  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)
    
    socket.emit('stats-update', globalStats)

    socket.on('game-result', (result: GameResult) => {
      updateGlobalStats(result.strategy, result.won)
      io?.emit('stats-update', globalStats)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  return io
}

function updateGlobalStats(strategy: 'stay' | 'switch', won: boolean) {
  globalStats.totalGames += 1
  
  if (strategy === 'stay') {
    globalStats.stayTotal += 1
    if (won) globalStats.stayWins += 1
  } else {
    globalStats.switchTotal += 1
    if (won) globalStats.switchWins += 1
  }
}

export function getGlobalStats(): Statistics {
  return { ...globalStats }
}

export function resetGlobalStats() {
  globalStats = {
    totalGames: 0,
    stayWins: 0,
    switchWins: 0,
    stayTotal: 0,
    switchTotal: 0,
  }
  io?.emit('stats-update', globalStats)
}