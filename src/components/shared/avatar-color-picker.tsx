'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface AvatarColorPickerProps {
  currentColor?: string | null
  availableColors: readonly string[] | string[]
  onColorChange: (color: string) => void
  isLoading?: boolean
}

export function AvatarColorPicker({
  currentColor,
  availableColors,
  onColorChange,
  isLoading = false,
}: AvatarColorPickerProps) {
  const handleColorSelect = (color: string) => {
    if (!isLoading) {
      onColorChange(color)
    }
  }

  if (!availableColors || availableColors.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {availableColors.map((color, index) => {
        if (!color) {
          console.warn(`Cor inválida no índice ${index}:`, color)
          return null
        }
        const isSelected = currentColor === color
        return (
          <button
            key={color || index}
            type="button"
            onClick={() => handleColorSelect(color)}
            disabled={isLoading}
            className={cn(
              'relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all hover:scale-110',
              isSelected ? 'border-primary shadow-md' : 'border-border hover:border-primary/50',
              isLoading && 'cursor-not-allowed opacity-50'
            )}
            style={{ backgroundColor: color }}
            aria-label={`Selecionar cor ${color}`}
          >
            {isSelected && <Check className="h-4 w-4 text-white drop-shadow-md" />}
          </button>
        )
      })}
    </div>
  )
}
