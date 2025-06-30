'use client'

export default function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-8 text-center">
        <p className="text-gray-600 text-sm">
          🎵 Vibe coded by{' '}
          <a 
            href="https://www.geoffreychallen.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-illinois-blue hover:text-illinois-blue/80 font-semibold transition-colors"
          >
            Geoffrey Challen
          </a>
          {' '}using{' '}
          <a 
            href="https://claude.ai/code" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-illinois-orange hover:text-illinois-orange/80 font-semibold transition-colors"
          >
            Claude Code
          </a>
        </p>
      </div>
    </footer>
  )
}