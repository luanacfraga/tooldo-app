import { apiClient } from '../api-client'
import { PaginatedResponse, PaginationParams } from '../types'

export type NotificationPreference = 'sms_only' | 'whatsapp_only' | 'both'

export interface User {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  role: 'master' | 'admin' | 'manager' | 'executor' | 'consultant'
  phone?: string | null
  notificationPreference?: NotificationPreference
}

export interface CreateUserRequest {
  email: string
  name: string
  password: string
  role: User['role']
}

export interface UpdateUserRequest {
  email?: string
  name?: string
  password?: string
  role?: User['role']
}

export interface AvatarColorsResponse {
  colors: readonly string[]
}

export interface UpdateAvatarColorRequest {
  avatarColor: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  notificationPreference?: NotificationPreference
  email?: string
  currentPassword?: string
}

export const usersApi = {
  getAll: (params?: PaginationParams & { role?: User['role'] }) =>
    apiClient.get<PaginatedResponse<User>>('/api/v1/users', {
      params: params as Record<string, string | number | boolean | undefined>,
    }),

  getById: (id: string) => apiClient.get<User>(`/users/${id}`),

  create: (data: CreateUserRequest) => apiClient.post<User>('/users', data),

  update: (id: string, data: UpdateUserRequest) => apiClient.put<User>(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete<void>(`/users/${id}`),

  getAvatarColors: () => apiClient.get<AvatarColorsResponse>('/api/v1/users/me/avatar-colors'),

  updateAvatarColor: (data: UpdateAvatarColorRequest) =>
    apiClient.patch<User>('/api/v1/users/me/avatar-color', data),

  updateProfile: (data: UpdateProfileRequest) =>
    apiClient.patch<User>('/api/v1/users/me/profile', data),
}
