'use client'

import { useState } from 'react'
import { AlertTriangle, ChevronDown, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ManagerDashboardAttentionExecutor } from '@/lib/types/manager-dashboard'

type Props = {
  attentionItems: ManagerDashboardAttentionExecutor[]
}

const REASON_CONFIG = {
  BLOCKED: {
    label: 'Bloqueada',
    icon: Lock,
    className: 'border-red-300 bg-red-50 text-red-700',
  },
  LATE: {
    label: 'Atrasada',
    icon: AlertTriangle,
    className: 'border-orange-300 bg-orange-50 text-orange-700',
  },
} as const

export function AttentionItemsByExecutor({ attentionItems }: Props) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (userId: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  if (attentionItems.length === 0) {
    return (
      <p className="py-6 text-center text-sm font-medium text-green-600">
        Nenhuma ação crítica
      </p>
    )
  }

  return (
    <div className="flex flex-col divide-y">
      {attentionItems.map((executor) => {
        const isOpen = openIds.has(executor.userId)
        return (
          <div key={executor.userId}>
            <button
              type="button"
              onClick={() => toggle(executor.userId)}
              className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-muted/40 px-1 rounded-md"
            >
              <span className="flex-1 text-sm font-medium">{executor.name}</span>
              <Badge
                variant="outline"
                className="text-xs bg-red-50 text-red-700 border-red-200"
              >
                {executor.criticalCount} crítica{executor.criticalCount !== 1 ? 's' : ''}
              </Badge>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="mb-2 ml-2 flex flex-col gap-1">
                {executor.actions.map((action) => {
                  const config = REASON_CONFIG[action.reason]
                  const Icon = config.icon
                  return (
                    <div
                      key={action.id}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5"
                    >
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 text-xs shrink-0 ${config.className}`}
                      >
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                      <span className="truncate text-sm text-foreground/80">
                        {action.title}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
