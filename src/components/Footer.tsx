'use client'

export default function Footer() {
  return (
    <footer className="mt-8 sm:mt-12 py-6 sm:py-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
          🎵 Vibe coded by{' '}
          <a 
            href="https://www.geoffreychallen.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-illinois-blue dark:text-illinois-orange hover:text-illinois-blue/80 dark:hover:text-illinois-orange/80 font-semibold transition-colors"
          >
            Geoffrey Challen
          </a>
          {' '}using{' '}
          <a 
            href="https://claude.ai/code" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-illinois-orange dark:text-illinois-blue hover:text-illinois-orange/80 dark:hover:text-illinois-blue/80 font-semibold transition-colors"
          >
            Claude Code
          </a>
        </p>
      </div>
    </footer>
  )
}