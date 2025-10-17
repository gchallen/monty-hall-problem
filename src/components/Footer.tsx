'use client'

import { useState, useEffect } from 'react'
import packageJson from '../../package.json'

export default function Footer() {
  const [uptime, setUptime] = useState<string>('')
  const [serverStartTime, setServerStartTime] = useState<number | null>(null)

  useEffect(() => {
    // Fetch initial server uptime
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    fetch(`${basePath}/api/uptime`)
      .then(res => res.json())
      .then(data => {
        setServerStartTime(data.startTime)
      })
      .catch(err => console.error('Failed to fetch uptime:', err))
  }, [])

  useEffect(() => {
    if (!serverStartTime) return

    const updateUptime = () => {
      const elapsed = Date.now() - serverStartTime
      const seconds = Math.floor(elapsed / 1000) % 60
      const minutes = Math.floor(elapsed / (1000 * 60)) % 60
      const hours = Math.floor(elapsed / (1000 * 60 * 60)) % 24
      const days = Math.floor(elapsed / (1000 * 60 * 60 * 24))

      let uptimeStr = ''
      if (days > 0) uptimeStr += `${days}d `
      if (hours > 0 || days > 0) uptimeStr += `${hours}h `
      if (minutes > 0 || hours > 0 || days > 0) uptimeStr += `${minutes}m `
      uptimeStr += `${seconds}s`

      setUptime(uptimeStr.trim())
    }

    updateUptime()
    const interval = setInterval(updateUptime, 1000)

    return () => clearInterval(interval)
  }, [serverStartTime])

  return (
    <footer className="mt-8 sm:mt-12 py-6 sm:py-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* How This Site Was Created */}
        <div className="mb-8 max-w-3xl mx-auto">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
            How This Site Was Created
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 mb-4">
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 italic">
              The initial version of this site was created by{' '}
              <a
                href="https://claude.ai/code"
                target="_blank"
                rel="noopener noreferrer"
                className="text-illinois-orange dark:text-orange-400 hover:text-illinois-orange/80 dark:hover:text-orange-300 font-semibold transition-colors"
              >
                Claude Code
              </a>
              {' '}using only the following specification:
            </p>
            <blockquote className="border-l-4 border-illinois-blue dark:border-blue-400 pl-4 py-2 bg-white dark:bg-gray-900 rounded">
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono leading-relaxed whitespace-pre-line">
                {`Create an interactive web-based simulation of the Monty Hall problem.
Use the latest versions of TypeScript, React, NextJS, and Tailwind.
Use Zod to perform runtime type checking when needed.
Commit changes incrementally with descriptive error messages.
Instead of a car, use acceptance to Illinois; instead of a goat, use acceptance to Purdue.
Build a beautiful and responsive modern web UI.
Show statistics from all previous simulations, updated live using WebSockets to reflect results from all clients.
Persist data in memory by default, but provide an option to save results to MongoDB.
Create both unit and integration tests.
Prepare for deployment to Vercel.`}
              </p>
            </blockquote>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            The interactive graph and ability to simulate many games were added later after a few more short interactions with Claude Code.
          </p>
        </div>

        <div className="text-center mb-3">
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
            🎵 Vibe coded by{' '}
            <a
              href="https://www.geoffreychallen.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-illinois-blue dark:text-blue-400 hover:text-illinois-blue/80 dark:hover:text-blue-300 font-semibold transition-colors"
            >
              Geoffrey Challen
            </a>
            {' '}using{' '}
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-illinois-orange dark:text-orange-400 hover:text-illinois-orange/80 dark:hover:text-orange-300 font-semibold transition-colors"
            >
              Claude Code
            </a>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div>
            <span className="font-medium">Version:</span> {packageJson.version}
          </div>
          <div className="hidden sm:block">•</div>
          <div>
            <span className="font-medium">Server Uptime:</span> {uptime || 'Loading...'}
          </div>
        </div>
      </div>
    </footer>
  )
}