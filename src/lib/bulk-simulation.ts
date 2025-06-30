import { Statistics } from '@/types/game'
import { createNewGame, makeInitialChoice, makeFinalChoice } from './game'

export interface BulkSimulationResult {
  stats: Statistics
  duration: number
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
  }

  const duration = performance.now() - startTime
  return { stats, duration }
}