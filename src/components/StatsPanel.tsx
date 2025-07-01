'use client'

import { Statistics } from '@/types/game'
import { calculateWinPercentage } from '@/lib/game'

interface StatsPanelProps {
  stats: Statistics
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const stayWinRate = calculateWinPercentage(stats.stayWins, stats.stayTotal)
  const switchWinRate = calculateWinPercentage(stats.switchWins, stats.switchTotal)
  const overallWinRate = calculateWinPercentage(
    stats.stayWins + stats.switchWins,
    stats.totalGames
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 transition-colors">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">
        Statistics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Overall</h3>
          <div className="text-2xl sm:text-3xl font-bold text-illinois-blue dark:text-blue-400 mb-1">
            {overallWinRate}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {stats.stayWins + stats.switchWins} wins out of {stats.totalGames} games
          </div>
        </div>

        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors">
          <h3 className="text-base sm:text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Stay Strategy</h3>
          <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
            {stayWinRate}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {stats.stayWins} wins out of {stats.stayTotal} games
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Theoretical: ~33%
          </div>
        </div>

        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors">
          <h3 className="text-base sm:text-lg font-semibold text-green-700 dark:text-green-400 mb-2">Switch Strategy</h3>
          <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {switchWinRate}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {stats.switchWins} wins out of {stats.switchTotal} games
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Theoretical: ~67%
          </div>
        </div>
      </div>

      {stats.totalGames > 0 && (
        <div className="mt-6 p-4 bg-illinois-blue/10 dark:bg-illinois-blue/20 rounded-lg transition-colors">
          <h4 className="font-semibold text-illinois-blue dark:text-blue-400 mb-2">Key Insights:</h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• Switching doors should win approximately 2/3 of the time</li>
            <li>• Staying with your original choice should win approximately 1/3 of the time</li>
            <li>• The more games you play, the closer your results should get to these theoretical probabilities</li>
            {stats.totalGames >= 10 && (
              <li className="font-medium">
                • Your results: Switch is winning {Math.round((switchWinRate - stayWinRate) * 100) / 100}% more often than staying
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}