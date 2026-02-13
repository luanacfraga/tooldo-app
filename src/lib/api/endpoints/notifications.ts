import { apiClient } from '../api-client'

export interface TriggerOverdueResponse {
  message: string
  executedAt: string
}

export interface NotificationHistoryItem {
  id: string
  actionId: string
  actionTitle: string
  notificationType: 'overdue_sms' | 'overdue_whatsapp'
  sentAt: string
  smsSent: boolean
  whatsappSent: boolean
  lateStatus: string | null
}

export const notificationsApi = {
  /** Dispara o job real de notificações de ações atrasadas. Apenas MASTER e ADMIN. */
  triggerOverdue: () =>
    apiClient.post<TriggerOverdueResponse>('/api/v1/notifications/trigger-overdue'),
  getMyHistory: (companyId: string) =>
    apiClient.get<NotificationHistoryItem[]>(
      `/api/v1/notifications/my-history?companyId=${companyId}`,
    ),
}
