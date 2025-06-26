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
    <div className="bg-white rounded-xl shadow-2xl p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Global Statistics (All Players)
        </h2>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-illinois-blue/10 rounded-lg">
          <h3 className="text-lg font-semibold text-illinois-blue mb-2">Total Games</h3>
          <div className="text-3xl font-bold text-illinois-blue">
            {stats.totalGames.toLocaleString()}
          </div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Overall Win Rate</h3>
          <div className="text-3xl font-bold text-illinois-blue mb-1">
            {overallWinRate}%
          </div>
          <div className="text-sm text-gray-600">
            {(stats.stayWins + stats.switchWins).toLocaleString()} Illinois acceptances
          </div>
        </div>

        <div className="text-center p-4 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Stay Strategy</h3>
          <div className="text-3xl font-bold text-red-600 mb-1">
            {stayWinRate}%
          </div>
          <div className="text-sm text-gray-600">
            {stats.stayWins.toLocaleString()} / {stats.stayTotal.toLocaleString()} games
          </div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Switch Strategy</h3>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {switchWinRate}%
          </div>
          <div className="text-sm text-gray-600">
            {stats.switchWins.toLocaleString()} / {stats.switchTotal.toLocaleString()} games
          </div>
        </div>
      </div>

      {stats.totalGames >= 100 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-illinois-blue/10 to-illinois-orange/10 rounded-lg">
          <h4 className="font-semibold text-illinois-blue mb-2">Live Global Results:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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