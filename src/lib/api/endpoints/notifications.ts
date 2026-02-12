import { apiClient } from '../api-client'

export interface TriggerOverdueResponse {
  message: string
  executedAt: string
}

export const notificationsApi = {
  /** Dispara o job real de notificações de ações atrasadas. Apenas MASTER e ADMIN. */
  triggerOverdue: () =>
    apiClient.post<TriggerOverdueResponse>('/api/v1/notifications/trigger-overdue'),
}
