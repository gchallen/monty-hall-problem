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
    const game = createNewGame()
    const initialChoice = Math.floor(Math.random() * 3)
    const hostReveal = makeInitialChoice(game, initialChoice)
    
    stats.totalGames++
    
    // Calculate both stay and switch outcomes for this single game
    // Stay with original choice
    const stayFinal = makeFinalChoice(hostReveal, initialChoice)
    stats.stayTotal++
    if (stayFinal.playerWon) {
      stats.stayWins++
    }
    
    // Switch to the other available door
    const availableDoor = hostReveal.doors.find(
      door => door.id !== initialChoice && !door.isOpen
    )
    
    if (!availableDoor) {
      throw new Error('No available door to switch to - this should never happen in Monty Hall')
    }
    
    const switchFinal = makeFinalChoice(hostReveal, availableDoor.id)
    stats.switchTotal++
    if (switchFinal.playerWon) {
      stats.switchWins++
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