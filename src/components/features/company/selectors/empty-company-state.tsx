import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyCompanyStateProps {
  onCreateCompany: () => void
  showLabel: boolean
  variant: 'default' | 'compact'
  className?: string
}

export function EmptyCompanyState({
  onCreateCompany,
  showLabel,
  variant,
  className,
}: EmptyCompanyStateProps) {
  return (
    <div className={cn('space-y-2 min-w-0', className)}>
      {showLabel && variant === 'default' && (
        <label className="text-xs font-medium text-muted-foreground truncate block">
          Empresa
        </label>
      )}
      <Button
        variant="outline"
        size={variant === 'compact' ? 'sm' : 'default'}
        onClick={onCreateCompany}
        className="w-full justify-start min-w-0"
      >
        <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
        <span className="truncate">Criar Primeira Empresa</span>
      </Button>
    </div>
  )
}
