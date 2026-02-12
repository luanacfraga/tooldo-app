'use client'

import { Bell } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useMyNotificationHistory } from '@/lib/services/queries/use-notifications'
import type { NotificationHistoryItem } from '@/lib/api/endpoints/notifications'

function typeLabel(item: NotificationHistoryItem) {
  if (item.smsSent && item.whatsappSent) return 'SMS + WhatsApp'
  if (item.smsSent) return 'SMS'
  if (item.whatsappSent) return 'WhatsApp'
  return 'Falha no envio'
}

function statusColor(item: NotificationHistoryItem) {
  return item.smsSent || item.whatsappSent
    ? 'text-emerald-600'
    : 'text-destructive'
}

export function NotificationBell() {
  const { data: history = [], isLoading } = useMyNotificationHistory()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 sm:h-10 sm:w-10"
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5 text-muted-foreground transition-colors duration-200 hover:text-foreground" />
          {history.length > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notificações enviadas</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-md bg-muted/60" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhuma notificação enviada ainda.
            </p>
          ) : (
            <ul className="divide-y">
              {history.map((item) => (
                <li key={item.id} className="px-4 py-3 hover:bg-muted/40">
                  <p className="truncate text-sm font-medium leading-tight">
                    {item.actionTitle}
                  </p>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <span className={`text-xs font-medium ${statusColor(item)}`}>
                      {typeLabel(item)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.sentAt
                        ? formatDistanceToNow(new Date(item.sentAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })
                        : '—'}
                    </span>
                  </div>
                  {item.lateStatus && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Status: {item.lateStatus}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
