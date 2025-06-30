import { Statistics } from '@/types/game'
import { createNewGame, makeInitialChoice, makeFinalChoice } from './game'

export interface ConvergenceDataPoint {
  gameNumber: number
  stayPercentage: number
  switchPercentage: number
  theoreticalStay: number
  theoreticalSwitch: number
}

export interface BulkSimulationResult {
  stats: Statistics
  duration: number
  convergenceData: ConvergenceDataPoint[]
}

export function simulateBulkGames(count: number): BulkSimulationResult {
  const startTime = performance.now()
  
  const stats: Statistics = {
    totalGames: 0,
    stayWins: 0,
    switchWins: 0,
    stayTotal: 0,
    switchTotal: 0,
  }

  const convergenceData: ConvergenceDataPoint[] = []
  
  // Calculate how often to record data points (aim for ~100 points max)
  const recordInterval = Math.max(1, Math.floor(count / 100))

  for (let i = 0; i < count; i++) {
    // Simulate a "stay" strategy game
    const stayGame = createNewGame()
    const stayInitialChoice = Math.floor(Math.random() * 3)
    const stayHostReveal = makeInitialChoice(stayGame, stayInitialChoice)
    const stayFinal = makeFinalChoice(stayHostReveal, stayInitialChoice)
    
    stats.stayTotal++
    stats.totalGames++
    if (stayFinal.playerWon) {
      stats.stayWins++
    }

    // Simulate a "switch" strategy game
    const switchGame = createNewGame()
    const switchInitialChoice = Math.floor(Math.random() * 3)
    const switchHostReveal = makeInitialChoice(switchGame, switchInitialChoice)
    
    // Find the door to switch to
    const availableDoor = switchHostReveal.doors.find(
      door => door.id !== switchInitialChoice && !door.isOpen
    )
    
    if (availableDoor) {
      const switchFinal = makeFinalChoice(switchHostReveal, availableDoor.id)
      stats.switchTotal++
      stats.totalGames++
      if (switchFinal.playerWon) {
        stats.switchWins++
      }
    }

    // Record convergence data at intervals or at the end
    if (i % recordInterval === 0 || i === count - 1) {
      const stayPercentage = stats.stayTotal > 0 ? (stats.stayWins / stats.stayTotal) * 100 : 0
      const switchPercentage = stats.switchTotal > 0 ? (stats.switchWins / stats.switchTotal) * 100 : 0
      
      convergenceData.push({
        gameNumber: i + 1,
        stayPercentage,
        switchPercentage,
        theoreticalStay: 33.33,
        theoreticalSwitch: 66.67
      })
    }
  }

  const duration = performance.now() - startTime
  return { stats, duration, convergenceData }
}