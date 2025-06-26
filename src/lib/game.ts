import { GameState, Door, GameResult } from '@/types/game'

export function createNewGame(): GameState {
  const illinoisDoor = Math.floor(Math.random() * 3)
  
  const doors: Door[] = [
    { id: 0, hasIllinois: illinoisDoor === 0, isOpen: false, isSelected: false },
    { id: 1, hasIllinois: illinoisDoor === 1, isOpen: false, isSelected: false },
    { id: 2, hasIllinois: illinoisDoor === 2, isOpen: false, isSelected: false },
  ]

  return {
    doors,
    phase: 'initial',
    initialChoice: null,
    finalChoice: null,
    hostRevealedDoor: null,
    playerWon: null,
    strategy: null,
  }
}

export function makeInitialChoice(gameState: GameState, doorId: number): GameState {
  if (gameState.phase !== 'initial') {
    throw new Error('Cannot make initial choice in current phase')
  }

  const newDoors = gameState.doors.map(door => ({
    ...door,
    isSelected: door.id === doorId,
  }))

  const hostRevealedDoor = revealHostDoor(newDoors, doorId)

  return {
    ...gameState,
    doors: newDoors.map(door => ({
      ...door,
      isOpen: door.id === hostRevealedDoor,
    })),
    phase: 'host-reveal',
    initialChoice: doorId,
    hostRevealedDoor,
  }
}

function revealHostDoor(doors: Door[], playerChoice: number): number {
  const availableDoors = doors
    .filter(door => door.id !== playerChoice && !door.hasIllinois)
    .map(door => door.id)
  
  if (availableDoors.length === 0) {
    const nonPlayerDoors = doors
      .filter(door => door.id !== playerChoice)
      .map(door => door.id)
    return nonPlayerDoors[Math.floor(Math.random() * nonPlayerDoors.length)]
  }
  
  return availableDoors[Math.floor(Math.random() * availableDoors.length)]
}

export function makeFinalChoice(gameState: GameState, doorId: number): GameState {
  if (gameState.phase !== 'host-reveal') {
    throw new Error('Cannot make final choice in current phase')
  }

  const strategy = doorId === gameState.initialChoice ? 'stay' : 'switch'
  const chosenDoor = gameState.doors.find(door => door.id === doorId)
  const playerWon = chosenDoor?.hasIllinois || false

  return {
    ...gameState,
    phase: 'game-over',
    finalChoice: doorId,
    strategy,
    playerWon,
  }
}

export function calculateWinPercentage(wins: number, total: number): number {
  return total > 0 ? Math.round((wins / total) * 100) : 0
}

export function generateGameResult(gameState: GameState, sessionId: string): GameResult {
  if (gameState.phase !== 'game-over' || gameState.strategy === null || gameState.playerWon === null) {
    throw new Error('Game is not complete')
  }

  return {
    id: crypto.randomUUID(),
    strategy: gameState.strategy,
    won: gameState.playerWon,
    timestamp: new Date(),
    sessionId,
  }
}