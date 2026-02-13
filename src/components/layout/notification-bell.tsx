'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { NotificationHistoryItem } from '@/lib/api/endpoints/notifications'
import { useUserContext } from '@/lib/contexts/user-context'
import { useReadNotificationIds } from '@/lib/hooks/use-read-notification-ids'
import { useMyNotificationHistory } from '@/lib/services/queries/use-notifications'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertCircle, Bell, CheckCheck, Clock, MessageCircle, Smartphone } from 'lucide-react'
import Link from 'next/link'

function typeLabel(item: NotificationHistoryItem) {
  if (item.smsSent && item.whatsappSent) return 'SMS + WhatsApp'
  if (item.smsSent) return 'SMS'
  if (item.whatsappSent) return 'WhatsApp'
  return 'Falha no envio'
}

function isSuccess(item: NotificationHistoryItem) {
  return item.smsSent || item.whatsappSent
}

function formatLateStatus(status: string) {
  const statusMap: Record<string, { label: string; variant: 'warning' | 'destructive' | 'info' }> =
    {
      LATE_TO_FINISH: { label: 'Atrasado para finalizar', variant: 'warning' },
      LATE_TO_START: { label: 'Atrasado para iniciar', variant: 'destructive' },
    }
  return statusMap[status] || { label: status, variant: 'info' }
}

interface NotificationItemProps {
  item: NotificationHistoryItem
  onMarkAsRead: (id: string) => void
}

function NotificationItem({ item, onMarkAsRead }: NotificationItemProps) {
  const success = isSuccess(item)
  const statusInfo = item.lateStatus ? formatLateStatus(item.lateStatus) : null

  return (
    <li className="group border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30">
      <Link
        href={`/actions?actionId=${item.actionId}`}
        className="flex gap-3 px-4 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/20"
        onClick={() => onMarkAsRead(item.id)}
      >
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
            success ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'
          )}
        >
          {item.whatsappSent && item.smsSent ? (
            <MessageCircle className="h-4.5 w-4.5" />
          ) : item.smsSent ? (
            <Smartphone className="h-4.5 w-4.5" />
          ) : item.whatsappSent ? (
            <MessageCircle className="h-4.5 w-4.5" />
          ) : (
            <AlertCircle className="h-4.5 w-4.5" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {item.actionTitle}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={success ? 'success' : 'destructive'}
              className="text-[10px] font-semibold"
            >
              {typeLabel(item)}
            </Badge>
            {statusInfo && (
              <Badge
                variant={statusInfo.variant}
                className="inline-flex items-center gap-1 text-[10px] font-semibold"
              >
                <Clock className="h-2.5 w-2.5" />
                {statusInfo.label}
              </Badge>
            )}
            <span className="ml-auto text-xs font-medium text-muted-foreground">
              {item.sentAt
                ? formatDistanceToNow(new Date(item.sentAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })
                : '—'}
            </span>
          </div>
        </div>
      </Link>
    </li>
  )
}

export function NotificationBell() {
  const { user, currentCompanyId } = useUserContext()
  const { data: history = [], isLoading } = useMyNotificationHistory(currentCompanyId)
  const { markAsRead, markAllAsRead, isRead } = useReadNotificationIds(user?.id, currentCompanyId)

  const unread = history.filter((item) => !isRead(item.id))
  const count = unread.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="group relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 sm:h-10 sm:w-10"
          aria-label={count > 0 ? `${count} notificações` : 'Notificações'}
        >
          <Bell className="h-5 w-5 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="z-[80] w-[380px] p-0 shadow-xl"
        side="bottom"
        sideOffset={6}
        alignOffset={0}
      >
        <div className="via-primary/3 flex items-center gap-3 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent px-4 py-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bell className="h-4.5 w-4.5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Notificações enviadas</p>
            <p className="text-xs text-muted-foreground">
              Ações atrasadas que geraram SMS ou WhatsApp
            </p>
          </div>
          {count > 0 && (
            <Badge variant="default" className="text-[10px] font-bold">
              {count}
            </Badge>
          )}
        </div>
        <div className="max-h-[380px] overflow-y-auto">
          {count > 0 && (
            <div className="border-b border-border/40 px-4 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-full justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                onClick={() => markAllAsRead(unread.map((item) => item.id))}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Marcar todas como lidas
              </Button>
            </div>
          )}
          {isLoading ? (
            <div className="space-y-1 p-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3 rounded-lg p-3">
                  <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-muted/60" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
                    <div className="h-3 w-16 animate-pulse rounded bg-muted/60" />
                  </div>
                </div>
              ))}
            </div>
          ) : count === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/60">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {history.length === 0
                  ? 'Nenhuma notificação ainda'
                  : 'Nenhuma notificação não lida'}
              </p>
              <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
                {history.length === 0
                  ? 'Quando houver ações atrasadas, as notificações enviadas aparecerão aqui.'
                  : 'Todas as notificações foram lidas.'}
              </p>
            </div>
          ) : (
            <ul>
              {unread.map((item) => (
                <NotificationItem key={item.id} item={item} onMarkAsRead={markAsRead} />
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
