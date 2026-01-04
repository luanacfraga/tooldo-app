import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  backHref?: string
  backLabel?: string
  className?: string
}

export function PageHeader({
  title,
  description,
  action,
  backHref,
  backLabel = 'Voltar',
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 border-b border-border/40 bg-gradient-to-b from-background via-background to-transparent pb-4 sm:mb-8 sm:pb-6', className)}>
      {backHref && (
        <div className="mb-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="-ml-2 text-muted-foreground hover:text-foreground"
          >
            <Link href={backHref}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
        </div>
      )}

      <div className="flex items-start gap-4 sm:items-center sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="truncate bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-xl font-semibold leading-tight tracking-tight text-transparent sm:text-2xl sm:font-bold sm:leading-snug lg:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="hidden text-xs leading-relaxed text-muted-foreground/80 transition-colors sm:block sm:text-sm sm:leading-normal">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0 [&_button]:h-9 [&_button]:text-xs [&_button]:px-3.5 [&_button]:gap-1.5 [&_button]:font-medium [&_button]:shadow-sm [&_button]:backdrop-blur-sm [&_button]:transition-all [&_button]:duration-150 [&_button]:hover:shadow-md [&_button]:hover:scale-[1.02] [&_button]:hover:-translate-y-0.5 [&_button]:active:scale-[0.97] [&_button]:sm:h-10 [&_button]:sm:text-sm [&_button]:sm:px-4 [&_button]:sm:gap-2 [&_a_button]:h-9 [&_a_button]:text-xs [&_a_button]:px-3.5 [&_a_button]:gap-1.5 [&_a_button]:font-medium [&_a_button]:shadow-sm [&_a_button]:backdrop-blur-sm [&_a_button]:transition-all [&_a_button]:duration-150 [&_a_button]:hover:shadow-md [&_a_button]:hover:scale-[1.02] [&_a_button]:hover:-translate-y-0.5 [&_a_button]:active:scale-[0.97] [&_a_button]:sm:h-10 [&_a_button]:sm:text-sm [&_a_button]:sm:px-4 [&_a_button]:sm:gap-2 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-150 [&_svg]:sm:h-4 [&_svg]:sm:w-4">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}

