import { notificationsApi } from '@/lib/api/endpoints/notifications'
import { useMutation } from '@tanstack/react-query'

export function useTriggerOverdueNotifications() {
  return useMutation({
    mutationFn: () => notificationsApi.triggerOverdue(),
  })
}
