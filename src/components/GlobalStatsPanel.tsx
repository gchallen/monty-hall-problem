'use client'

import { Statistics } from '@/types/game'
import { calculateWinPercentage } from '@/lib/game'

interface GlobalStatsPanelProps {
  stats: Statistics
  isConnected: boolean
}

export default function GlobalStatsPanel({ stats, isConnected }: GlobalStatsPanelProps) {
  const stayWinRate = calculateWinPercentage(stats.stayWins, stats.stayTotal)
  const switchWinRate = calculateWinPercentage(stats.switchWins, stats.switchTotal)
  const overallWinRate = calculateWinPercentage(
    stats.stayWins + stats.switchWins,
    stats.totalGames
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 mt-8 transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
          Global Statistics (All Players)
        </h2>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <div className="text-center p-4 bg-illinois-blue/10 dark:bg-illinois-blue/20 rounded-lg transition-colors">
          <h3 className="text-sm sm:text-lg font-semibold text-illinois-blue dark:text-blue-400 mb-1 sm:mb-2">Total Games</h3>
          <div className="text-xl sm:text-3xl font-bold text-illinois-blue dark:text-blue-400">
            {stats.totalGames.toLocaleString()}
          </div>
        </div>

        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">Overall Win Rate</h3>
          <div className="text-xl sm:text-3xl font-bold text-illinois-blue dark:text-illinois-orange mb-1">
            {overallWinRate}%
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {(stats.stayWins + stats.switchWins).toLocaleString()} Illinois acceptances
          </div>
        </div>

        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors">
          <h3 className="text-sm sm:text-lg font-semibold text-red-700 dark:text-red-400 mb-1 sm:mb-2">Stay Strategy</h3>
          <div className="text-xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
            {stayWinRate}%
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {stats.stayWins.toLocaleString()} / {stats.stayTotal.toLocaleString()} games
          </div>
        </div>

        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors">
          <h3 className="text-sm sm:text-lg font-semibold text-green-700 dark:text-green-400 mb-1 sm:mb-2">Switch Strategy</h3>
          <div className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {switchWinRate}%
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {stats.switchWins.toLocaleString()} / {stats.switchTotal.toLocaleString()} games
          </div>
        </div>
      </div>

      {stats.totalGames === 0 && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Global Statistics:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            These statistics show results from all players across all sessions. Play some games to contribute 
            to the global data and see how the stay vs switch strategies compare!
          </p>
        </div>
      )}

      {stats.totalGames >= 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-illinois-blue/10 to-illinois-orange/10 dark:from-illinois-blue/20 dark:to-illinois-orange/20 rounded-lg transition-colors">
          <h4 className="font-semibold text-illinois-blue dark:text-blue-400 mb-2">Live Global Results:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm dark:text-gray-300">
            <div>
              <strong>Switch Advantage:</strong> {Math.abs(switchWinRate - stayWinRate).toFixed(1)}% higher win rate
            </div>
            <div>
              <strong>Theoretical vs Actual:</strong> Switch should be ~67%, Stay should be ~33%
            </div>
          </div>
        </div>
      )}
    </div>
  )
}