import { z } from 'zod'

export const DoorSchema = z.object({
  id: z.number(),
  hasIllinois: z.boolean(),
  isOpen: z.boolean(),
  isSelected: z.boolean(),
})

export const GameStateSchema = z.object({
  doors: z.array(DoorSchema),
  phase: z.enum(['initial', 'host-reveal', 'final-choice', 'game-over']),
  initialChoice: z.number().nullable(),
  finalChoice: z.number().nullable(),
  hostRevealedDoor: z.number().nullable(),
  playerWon: z.boolean().nullable(),
  strategy: z.enum(['stay', 'switch']).nullable(),
})

export const GameResultSchema = z.object({
  id: z.string(),
  strategy: z.enum(['stay', 'switch']),
  won: z.boolean(),
  timestamp: z.date(),
  sessionId: z.string(),
})

export const StatisticsSchema = z.object({
  totalGames: z.number(),
  stayWins: z.number(),
  switchWins: z.number(),
  stayTotal: z.number(),
  switchTotal: z.number(),
})

export type Door = z.infer<typeof DoorSchema>
export type GameState = z.infer<typeof GameStateSchema>
export type GameResult = z.infer<typeof GameResultSchema>
export type Statistics = z.infer<typeof StatisticsSchema>