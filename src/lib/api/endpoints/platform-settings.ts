import { apiClient } from '../api-client'

export interface PlatformSettings {
  supportWhatsapp: string | null
  supportEmail: string | null
}

export interface UpdatePlatformSettingsRequest {
  supportWhatsapp?: string
  supportEmail?: string
}

export const platformSettingsApi = {
  get: () => apiClient.get<PlatformSettings>('/api/v1/platform-settings'),
  update: (data: UpdatePlatformSettingsRequest) =>
    apiClient.patch<PlatformSettings>('/api/v1/platform-settings', data),
}
