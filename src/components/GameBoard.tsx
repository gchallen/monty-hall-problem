'use client'

import { useState, useEffect } from 'react'
import { GameState, Statistics } from '@/types/game'
import { createNewGame, makeInitialChoice, makeFinalChoice, generateGameResult } from '@/lib/game'
import { useWebSocket } from '@/lib/websocket-client'
import Door from './Door'
import StatsPanel from './StatsPanel'
import GlobalStatsPanel from './GlobalStatsPanel'

export default function GameBoard() {
  const [gameState, setGameState] = useState<GameState>(createNewGame())
  const [stats, setStats] = useState<Statistics>({
    totalGames: 0,
    stayWins: 0,
    switchWins: 0,
    stayTotal: 0,
    switchTotal: 0,
  })
  const [sessionId] = useState(() => crypto.randomUUID())
  const { globalStats, isConnected, sendGameResult } = useWebSocket()

  const handleDoorClick = (doorId: number) => {
    if (gameState.phase === 'initial') {
      setGameState(makeInitialChoice(gameState, doorId))
    } else if (gameState.phase === 'host-reveal') {
      const newGameState = makeFinalChoice(gameState, doorId)
      setGameState(newGameState)
      
      const result = generateGameResult(newGameState, sessionId)
      updateStats(result.strategy, result.won)
      sendGameResult(result)
    }
  }

  const updateStats = (strategy: 'stay' | 'switch', won: boolean) => {
    setStats(prevStats => ({
      totalGames: prevStats.totalGames + 1,
      stayWins: prevStats.stayWins + (strategy === 'stay' && won ? 1 : 0),
      switchWins: prevStats.switchWins + (strategy === 'switch' && won ? 1 : 0),
      stayTotal: prevStats.stayTotal + (strategy === 'stay' ? 1 : 0),
      switchTotal: prevStats.switchTotal + (strategy === 'switch' ? 1 : 0),
    }))
  }

  const resetGame = () => {
    setGameState(createNewGame())
  }

  const getPhaseMessage = () => {
    switch (gameState.phase) {
      case 'initial':
        return 'Choose a door to see if you get accepted to Illinois!'
      case 'host-reveal':
        return 'I opened a door with a Purdue acceptance. Do you want to switch or stay with your original choice?'
      case 'game-over':
        if (gameState.playerWon) {
          return '🎉 Congratulations! You got accepted to Illinois!'
        } else {
          return '😔 You got accepted to Purdue. Better luck next time!'
        }
      default:
        return ''
    }
  }

  const canClickDoor = (doorId: number) => {
    if (gameState.phase === 'initial') return true
    if (gameState.phase === 'host-reveal') return !gameState.doors[doorId].isOpen
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-illinois-blue to-purdue-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            The Monty Hall Problem: Illinois vs Purdue Edition
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Behind one door is acceptance to the University of Illinois, behind the other two are Purdue acceptances. 
            Choose wisely and see if switching doors really improves your odds!
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-6">
            <p className="text-xl font-semibold text-gray-800">
              {getPhaseMessage()}
            </p>
          </div>

          <div className="flex justify-center gap-8 mb-8">
            {gameState.doors.map((door) => (
              <Door
                key={door.id}
                door={door}
                onClick={() => handleDoorClick(door.id)}
                disabled={!canClickDoor(door.id)}
                showContent={gameState.phase === 'game-over'}
              />
            ))}
          </div>

          {gameState.phase === 'host-reveal' && (
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Your original choice was Door {(gameState.initialChoice || 0) + 1}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleDoorClick(gameState.initialChoice!)}
                  className="px-6 py-2 bg-illinois-blue text-white rounded-lg hover:bg-illinois-blue/90 transition-colors"
                >
                  Stay with Door {(gameState.initialChoice || 0) + 1}
                </button>
                <button
                  onClick={() => {
                    const availableDoor = gameState.doors.find(
                      door => door.id !== gameState.initialChoice && !door.isOpen
                    )
                    if (availableDoor) handleDoorClick(availableDoor.id)
                  }}
                  className="px-6 py-2 bg-illinois-orange text-white rounded-lg hover:bg-illinois-orange/90 transition-colors"
                >
                  Switch Doors
                </button>
              </div>
            </div>
          )}

          {gameState.phase === 'game-over' && (
            <div className="text-center">
              <div className="mb-4">
                <p className="text-lg">
                  You chose to <strong>{gameState.strategy}</strong> and 
                  <strong className={gameState.playerWon ? 'text-green-600' : 'text-red-600'}>
                    {gameState.playerWon ? ' won' : ' lost'}
                  </strong>!
                </p>
              </div>
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-illinois-blue text-white rounded-lg hover:bg-illinois-blue/90 transition-colors font-semibold"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        <StatsPanel stats={stats} />
        <GlobalStatsPanel stats={globalStats} isConnected={isConnected} />
      </div>
    </div>
  )
}