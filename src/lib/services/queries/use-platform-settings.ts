import { platformSettingsApi } from '@/lib/api/endpoints/platform-settings'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const PLATFORM_SETTINGS_KEY = ['platform-settings'] as const

export function usePlatformSettings() {
  return useQuery({
    queryKey: PLATFORM_SETTINGS_KEY,
    queryFn: () => platformSettingsApi.get(),
    staleTime: 5 * 60_000, // 5 minutes
  })
}

export function useUpdatePlatformSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: platformSettingsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLATFORM_SETTINGS_KEY })
    },
  })
}
