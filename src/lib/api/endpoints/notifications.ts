import { apiClient } from '../api-client'

export interface TestTwilioResponse {
  sent: boolean
  message: string
  sentAt: string
}

export const notificationsApi = {
  /** Envia um SMS de teste via Twilio para o telefone do admin. Apenas para testes. */
  sendTestTwilio: () =>
    apiClient.post<TestTwilioResponse>('/api/v1/notifications/test-twilio'),
}
