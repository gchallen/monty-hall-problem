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
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">
        Probability Convergence Over {totalGames.toLocaleString()} Games
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        Watch how the actual win percentages converge to the theoretical values as more games are played.
      </p>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="gameNumber" 
            stroke="#666"
            tick={{ fontSize: 12 }}
            label={{ value: 'Number of Games', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            stroke="#666"
            tick={{ fontSize: 12 }}
            domain={[0, 100]}
            label={{ value: 'Win Percentage (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}%`, 
              name === 'stayPercentage' ? 'Stay Strategy' :
              name === 'switchPercentage' ? 'Switch Strategy' :
              name === 'theoreticalStay' ? 'Theoretical Stay' :
              'Theoretical Switch'
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

      <div className="mt-4 text-xs text-gray-500">
        <p>
          • <span className="text-blue-600 font-semibold">Blue line</span>: Actual stay strategy performance
        </p>
        <p>
          • <span className="text-orange-600 font-semibold">Orange line</span>: Actual switch strategy performance
        </p>
        <p>
          • <span className="text-gray-400 font-semibold">Dashed lines</span>: Theoretical probabilities (33.3% and 66.7%)
        </p>
      </div>
    </div>
  )
}