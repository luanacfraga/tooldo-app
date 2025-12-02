import { apiClient } from '../api-client'
import { PaginatedResponse, PaginationParams } from '../types'

export interface Company {
  id: string
  name: string
  description?: string
  adminId: string
  createdAt: string
  updatedAt: string
}

export interface CreateCompanyRequest {
  name: string
  description?: string
  adminId: string
}

export interface UpdateCompanyRequest {
  name?: string
}

export const companiesApi = {
  getAll: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Company>>('/api/v1/companies', {
      params: params as Record<string, string | number | boolean | undefined>
    }),

  /**
   * Get all companies for the authenticated admin
   * Uses the token to identify the admin automatically
   */
  getMyCompanies: () =>
    apiClient.get<Company[]>('/api/v1/companies/me'),

  getByAdmin: (adminId: string) =>
    apiClient.get<Company[]>(`/api/v1/companies/admin/${adminId}`),

  getById: (id: string) =>
    apiClient.get<Company>(`/api/v1/companies/${id}`),

  create: (data: CreateCompanyRequest) =>
    apiClient.post<Company>('/api/v1/companies', data),

  update: (id: string, data: UpdateCompanyRequest) =>
    apiClient.put<Company>(`/api/v1/companies/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/api/v1/companies/${id}`),
}
