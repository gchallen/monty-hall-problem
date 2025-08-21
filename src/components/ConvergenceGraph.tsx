'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { ConvergenceDataPoint } from '@/lib/bulk-simulation'

interface ConvergenceGraphProps {
  data: ConvergenceDataPoint[]
  totalGames: number
}

export default function ConvergenceGraph({ data, totalGames }: ConvergenceGraphProps) {
  if (!data || data.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 border border-gray-200 dark:border-gray-600 transition-colors">
      <h4 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-4">
        Probability Convergence Over {totalGames.toLocaleString()} Games
      </h4>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 sm:mb-4">
        Watch how the actual win percentages converge to the theoretical values as more games are played. 
        The logarithmic X-axis scale highlights early convergence behavior.
      </p>
      
      <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 40,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-600" />
          <XAxis 
            dataKey="gameNumber" 
            stroke="#666"
            tick={{ fontSize: 10 }}
            scale="log"
            domain={['dataMin', 'dataMax']}
            allowDataOverflow={false}
            label={{ value: 'Number of Games (Log Scale)', position: 'insideBottom', offset: -10, style: { fontSize: 11 } }}
            tickFormatter={(value) => {
              if (value >= 10000) return `${(value / 1000).toFixed(0)}k`
              if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
              return value.toString()
            }}
          />
          <YAxis 
            stroke="#666"
            tick={{ fontSize: 10 }}
            domain={[0, 100]}
            label={{ value: 'Win Percentage (%)', angle: -90, position: 'insideLeft', style: { fontSize: 11, textAnchor: 'middle' } }}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}%`, 
              name === 'stayPercentage' ? 'Stay Strategy' :
              name === 'switchPercentage' ? 'Switch Strategy' :
              name
            ]}
            labelFormatter={(label) => `After ${label} games`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
          />
          
          {/* Theoretical reference lines */}
          <ReferenceLine 
            y={33.33} 
            stroke="#94a3b8" 
            strokeDasharray="5 5" 
            strokeWidth={2}
          />
          <ReferenceLine 
            y={66.67} 
            stroke="#94a3b8" 
            strokeDasharray="5 5" 
            strokeWidth={2}
          />
          
          {/* Actual performance lines */}
          <Line
            type="monotone"
            dataKey="stayPercentage"
            stroke="#1e40af"
            strokeWidth={3}
            dot={{ fill: '#1e40af', r: 2 }}
            name="Stay Strategy"
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="switchPercentage"
            stroke="#ea580c"
            strokeWidth={3}
            dot={{ fill: '#ea580c', r: 2 }}
            name="Switch Strategy"
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-2 sm:mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>
          • <span className="text-blue-600 dark:text-blue-400 font-semibold">Blue line</span>: Actual stay strategy performance
        </p>
        <p>
          • <span className="text-orange-600 dark:text-orange-400 font-semibold">Orange line</span>: Actual switch strategy performance
        </p>
        <p>
          • <span className="text-gray-400 dark:text-gray-500 font-semibold">Dashed lines</span>: Theoretical probabilities (33.3% and 66.7%)
        </p>
        <p className="mt-2 text-xs">
          Note: The X-axis uses a logarithmic scale to better show early convergence patterns.
        </p>
      </div>
    </div>
  )
}