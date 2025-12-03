import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  label?: string
  className?: string
}

const statusConfig: Record<string, { label: string; color: string; dotColor: string }> = {
  ACTIVE: {
    label: 'Ativo',
    color: 'bg-success/10 text-success dark:bg-success/20 dark:text-success',
    dotColor: 'bg-success',
  },
  INACTIVE: {
    label: 'Inativo',
    color: 'bg-muted text-muted-foreground dark:bg-muted/50 dark:text-muted-foreground',
    dotColor: 'bg-muted-foreground/50',
  },
  SUSPENDED: {
    label: 'Suspenso',
    color: 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning',
    dotColor: 'bg-warning',
  },
  PENDING: {
    label: 'Pendente',
    color: 'bg-info/10 text-info dark:bg-info/20 dark:text-info',
    dotColor: 'bg-info',
  },
  INVITED: {
    label: 'Convidado',
    color: 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning',
    dotColor: 'bg-warning',
  },
  REJECTED: {
    label: 'Rejeitado',
    color: 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive',
    dotColor: 'bg-destructive',
  },
  REMOVED: {
    label: 'Removido',
    color: 'bg-muted text-muted-foreground dark:bg-muted/50 dark:text-muted-foreground',
    dotColor: 'bg-muted-foreground/50',
  },
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: label || status,
    color: 'bg-muted text-muted-foreground',
    dotColor: 'bg-muted-foreground/50',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm backdrop-blur-sm transition-all duration-200 border border-current/10',
        config.color,
        className
      )}
    >
      <div className={cn('h-1.5 w-1.5 rounded-full animate-pulse', config.dotColor)} />
      {config.label}
    </span>
  )
}

