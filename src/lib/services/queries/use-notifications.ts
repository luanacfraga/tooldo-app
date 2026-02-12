import { notificationsApi } from '@/lib/api/endpoints/notifications'
import { useMutation } from '@tanstack/react-query'

export function useSendTestTwilio() {
  return useMutation({
    mutationFn: () => notificationsApi.sendTestTwilio(),
  })
}
