'use client'

import { useState } from 'react'
import { Statistics } from '@/types/game'
import { simulateBulkGames, ConvergenceDataPoint } from '@/lib/bulk-simulation'
import { calculateWinPercentage } from '@/lib/game'
import ConvergenceGraph from './ConvergenceGraph'

interface BulkSimulatorProps {
  onSimulationComplete: (stats: Statistics) => void
}

export default function BulkSimulator({ onSimulationComplete }: BulkSimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false)
  const [lastSimulation, setLastSimulation] = useState<{
    count: number
    duration: number
    stats: Statistics
    convergenceData: ConvergenceDataPoint[]
  } | null>(null)

  const runSimulation = async (count: number) => {
    setIsSimulating(true)
    
    // Use setTimeout to ensure UI updates before blocking computation
    setTimeout(() => {
      const result = simulateBulkGames(count)
      
      setLastSimulation({
        count,
        duration: result.duration,
        stats: result.stats,
        convergenceData: result.convergenceData
      })
      
      onSimulationComplete(result.stats)
      setIsSimulating(false)
    }, 10)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 mb-8 transition-colors">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Bulk Simulation</h2>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
        Run multiple games at once to see how the probabilities converge to the theoretical values 
        (Stay: 33.3%, Switch: 66.7%)
      </p>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
        <button
          onClick={() => runSimulation(100)}
          disabled={isSimulating}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-illinois-blue text-white rounded-lg hover:bg-illinois-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base"
        >
          Run 100 Games
        </button>
        <button
          onClick={() => runSimulation(1000)}
          disabled={isSimulating}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-illinois-blue text-white rounded-lg hover:bg-illinois-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base"
        >
          Run 1,000 Games
        </button>
        <button
          onClick={() => runSimulation(10000)}
          disabled={isSimulating}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-illinois-blue text-white rounded-lg hover:bg-illinois-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base"
        >
          Run 10,000 Games
        </button>
      </div>

      {isSimulating && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-illinois-blue"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Simulating games...</p>
        </div>
      )}

      {lastSimulation && !isSimulating && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 transition-colors">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Results from {lastSimulation.count.toLocaleString()} games 
            <span className="text-xs sm:text-sm font-normal text-gray-600 dark:text-gray-300 ml-1 sm:ml-2 block sm:inline">
              (completed in {lastSimulation.duration.toFixed(0)}ms)
            </span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-gray-600 rounded-lg p-4 border border-gray-200 dark:border-gray-500 transition-colors">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Stay Strategy</h4>
              <p className="text-3xl font-bold text-illinois-blue dark:text-blue-400">
                {calculateWinPercentage(lastSimulation.stats.stayWins, lastSimulation.stats.stayTotal)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {lastSimulation.stats.stayWins.toLocaleString()} wins / {lastSimulation.stats.totalGames.toLocaleString()} games
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Theoretical: 33.3%
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-600 rounded-lg p-4 border border-gray-200 dark:border-gray-500 transition-colors">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Switch Strategy</h4>
              <p className="text-3xl font-bold text-illinois-orange dark:text-orange-400">
                {calculateWinPercentage(lastSimulation.stats.switchWins, lastSimulation.stats.switchTotal)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {lastSimulation.stats.switchWins.toLocaleString()} wins / {lastSimulation.stats.totalGames.toLocaleString()} games
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Theoretical: 66.7%
              </p>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <p>
              Difference from theoretical: Stay {Math.abs(calculateWinPercentage(lastSimulation.stats.stayWins, lastSimulation.stats.stayTotal) - 33.3).toFixed(1)}%, 
              Switch {Math.abs(calculateWinPercentage(lastSimulation.stats.switchWins, lastSimulation.stats.switchTotal) - 66.7).toFixed(1)}%
            </p>
          </div>
          
          <div className="mt-6">
            <ConvergenceGraph 
              data={lastSimulation.convergenceData} 
              totalGames={lastSimulation.count}
            />
          </div>
        </div>
      )}
    </div>
  )
}