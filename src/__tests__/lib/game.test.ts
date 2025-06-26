import {
  createNewGame,
  makeInitialChoice,
  makeFinalChoice,
  calculateWinPercentage,
  generateGameResult,
} from '@/lib/game'
import { GameState } from '@/types/game'

describe('Game Logic', () => {
  describe('createNewGame', () => {
    it('should create a new game with correct initial state', () => {
      const game = createNewGame()
      
      expect(game.doors).toHaveLength(3)
      expect(game.phase).toBe('initial')
      expect(game.initialChoice).toBeNull()
      expect(game.finalChoice).toBeNull()
      expect(game.hostRevealedDoor).toBeNull()
      expect(game.playerWon).toBeNull()
      expect(game.strategy).toBeNull()
      
      // Exactly one door should have Illinois
      const illinoisDoors = game.doors.filter(door => door.hasIllinois)
      expect(illinoisDoors).toHaveLength(1)
      
      // All doors should be closed and unselected initially
      game.doors.forEach(door => {
        expect(door.isOpen).toBe(false)
        expect(door.isSelected).toBe(false)
      })
    })
  })

  describe('makeInitialChoice', () => {
    it('should update game state after initial choice', () => {
      const game = createNewGame()
      const chosenDoor = 0
      
      const updatedGame = makeInitialChoice(game, chosenDoor)
      
      expect(updatedGame.phase).toBe('host-reveal')
      expect(updatedGame.initialChoice).toBe(chosenDoor)
      expect(updatedGame.doors[chosenDoor].isSelected).toBe(true)
      expect(updatedGame.hostRevealedDoor).not.toBeNull()
      
      // Host should reveal a door that's not the player's choice and doesn't have Illinois (if possible)
      const revealedDoor = updatedGame.doors[updatedGame.hostRevealedDoor!]
      expect(revealedDoor.isOpen).toBe(true)
      expect(updatedGame.hostRevealedDoor).not.toBe(chosenDoor)
    })

    it('should throw error if not in initial phase', () => {
      const game = createNewGame()
      const gameInProgress = { ...game, phase: 'host-reveal' as const }
      
      expect(() => makeInitialChoice(gameInProgress, 0)).toThrow(
        'Cannot make initial choice in current phase'
      )
    })
  })

  describe('makeFinalChoice', () => {
    it('should complete the game with stay strategy', () => {
      let game = createNewGame()
      game = makeInitialChoice(game, 0)
      
      const finalGame = makeFinalChoice(game, 0) // Same as initial choice = stay
      
      expect(finalGame.phase).toBe('game-over')
      expect(finalGame.finalChoice).toBe(0)
      expect(finalGame.strategy).toBe('stay')
      expect(finalGame.playerWon).toBe(game.doors[0].hasIllinois)
    })

    it('should complete the game with switch strategy', () => {
      let game = createNewGame()
      game = makeInitialChoice(game, 0)
      
      // Find the door that's not the initial choice and not revealed
      const switchDoor = game.doors.find(
        door => door.id !== 0 && !door.isOpen
      )!
      
      const finalGame = makeFinalChoice(game, switchDoor.id)
      
      expect(finalGame.phase).toBe('game-over')
      expect(finalGame.finalChoice).toBe(switchDoor.id)
      expect(finalGame.strategy).toBe('switch')
      expect(finalGame.playerWon).toBe(switchDoor.hasIllinois)
    })

    it('should throw error if not in host-reveal phase', () => {
      const game = createNewGame()
      
      expect(() => makeFinalChoice(game, 0)).toThrow(
        'Cannot make final choice in current phase'
      )
    })
  })

  describe('calculateWinPercentage', () => {
    it('should calculate correct percentage', () => {
      expect(calculateWinPercentage(33, 100)).toBe(33)
      expect(calculateWinPercentage(67, 100)).toBe(67)
      expect(calculateWinPercentage(1, 3)).toBe(33)
      expect(calculateWinPercentage(2, 3)).toBe(67)
    })

    it('should return 0 for zero total', () => {
      expect(calculateWinPercentage(5, 0)).toBe(0)
    })
  })

  describe('generateGameResult', () => {
    it('should generate correct game result', () => {
      let game = createNewGame()
      game = makeInitialChoice(game, 0)
      game = makeFinalChoice(game, 0)
      
      const result = generateGameResult(game, 'test-session')
      
      expect(result.id).toBe('test-uuid-1234') // From mocked crypto
      expect(result.strategy).toBe('stay')
      expect(result.won).toBe(game.playerWon)
      expect(result.sessionId).toBe('test-session')
      expect(result.timestamp).toBeInstanceOf(Date)
    })

    it('should throw error if game is not complete', () => {
      const game = createNewGame()
      
      expect(() => generateGameResult(game, 'test-session')).toThrow(
        'Game is not complete'
      )
    })
  })

  describe('Game probability simulation', () => {
    it('should demonstrate switching wins more often', () => {
      const trials = 1000
      let stayWins = 0
      let switchWins = 0
      
      for (let i = 0; i < trials; i++) {
        let game = createNewGame()
        game = makeInitialChoice(game, 0)
        
        // Test stay strategy
        const stayGame = makeFinalChoice({ ...game }, 0)
        if (stayGame.playerWon) stayWins++
        
        // Test switch strategy
        const switchDoor = game.doors.find(door => door.id !== 0 && !door.isOpen)!
        const switchGame = makeFinalChoice({ ...game }, switchDoor.id)
        if (switchGame.playerWon) switchWins++
      }
      
      const stayRate = stayWins / trials
      const switchRate = switchWins / trials
      
      // Allow some variance due to randomness, but switching should generally win more
      expect(switchRate).toBeGreaterThan(stayRate)
      // Rough check - stay should be around 1/3, switch around 2/3
      expect(stayRate).toBeLessThan(0.4)
      expect(switchRate).toBeGreaterThan(0.6)
    })
  })
})