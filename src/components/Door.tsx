'use client'

import { Door as DoorType } from '@/types/game'

interface DoorProps {
  door: DoorType
  onClick: () => void
  disabled: boolean
  showContent: boolean
}

export default function Door({ door, onClick, disabled, showContent }: DoorProps) {
  const isClickable = !disabled && !door.isOpen

  return (
    <div
      className={`
        relative w-24 sm:w-28 md:w-32 h-36 sm:h-42 md:h-48 border-2 sm:border-3 md:border-4 rounded-lg cursor-pointer transition-all duration-300 transform
        ${door.isSelected ? 'border-illinois-blue bg-illinois-blue/10 dark:bg-illinois-blue/20 scale-105' : 'border-gray-400 bg-white dark:bg-gray-700'}
        ${isClickable ? 'hover:scale-105 hover:shadow-lg' : ''}
        ${disabled ? 'cursor-not-allowed opacity-75' : ''}
        ${door.isOpen ? 'bg-gray-100 dark:bg-gray-600' : ''}
      `}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
        <div className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-center dark:text-gray-100">Door {door.id + 1}</div>
        
        {(door.isOpen || showContent) && (
          <div className="text-center">
            {door.hasIllinois ? (
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">🎓</div>
                <div className="text-xs sm:text-sm font-bold text-illinois-blue dark:text-illinois-orange">Illinois</div>
                <div className="text-xs text-illinois-orange">Acceptance!</div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">🏫</div>
                <div className="text-xs sm:text-sm font-bold text-purdue-black dark:text-gray-300">Purdue</div>
                <div className="text-xs text-purdue-gold">Acceptance</div>
              </div>
            )}
          </div>
        )}

        {!door.isOpen && !showContent && (
          <div className="text-4xl sm:text-5xl md:text-6xl opacity-30 dark:text-gray-400">?</div>
        )}
      </div>

      {door.isSelected && (
        <div className="absolute -top-2 -right-2 bg-illinois-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          ✓
        </div>
      )}
    </div>
  )
}