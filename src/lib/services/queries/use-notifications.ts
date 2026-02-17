import { notificationsApi } from '@/lib/api/endpoints/notifications'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useTriggerOverdueNotifications() {
  return useMutation({
    mutationFn: () => notificationsApi.triggerOverdue(),
  })
}

export const NOTIFICATION_HISTORY_KEY = ['notifications', 'my-history'] as const

export function useMyNotificationHistory(companyId: string | null | undefined) {
  return useQuery({
    queryKey: [...NOTIFICATION_HISTORY_KEY, companyId],
    queryFn: () => notificationsApi.getMyHistory(companyId!),
    enabled: !!companyId,
    staleTime: 60_000, // 1 minute
  })
}
