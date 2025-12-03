import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('animate-fade-in border-dashed border-border/30', className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 sm:py-20">
        {Icon && (
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md sm:p-6">
            <Icon className="h-8 w-8 text-primary/70 transition-transform duration-200 hover:scale-110 sm:h-12 sm:w-12" />
          </div>
        )}
        <h3 className="mt-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-lg font-semibold text-transparent sm:text-xl">
          {title}
        </h3>
        {description && (
          <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground/80 sm:max-w-md sm:text-base">
            {description}
          </p>
        )}
        {action && (
          <Button onClick={action.onClick} className="mt-8 shadow-sm transition-all duration-150 hover:shadow-md" size="lg">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

