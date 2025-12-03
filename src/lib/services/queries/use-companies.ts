import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { companiesApi } from '@/lib/api/endpoints/companies'
import { useCompanyStore } from '@/lib/stores/company-store'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { Company, CreateCompanyRequest } from '@/lib/types/api'

const COMPANIES_KEY = ['companies'] as const

export function useCompanies() {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: COMPANIES_KEY,
    queryFn: () => companiesApi.getMyCompanies(),
    select: (data) => data || [],
    enabled: isAuthenticated,
  })
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: [...COMPANIES_KEY, id],
    queryFn: () => companiesApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()
  const { addCompany, selectCompany } = useCompanyStore()

  return useMutation({
    mutationFn: (data: CreateCompanyRequest) => companiesApi.create(data),
    onSuccess: (newCompany) => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEY })
      addCompany(newCompany)
      selectCompany(newCompany)
    },
  })
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string } }) =>
      companiesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEY })
      queryClient.invalidateQueries({ queryKey: [...COMPANIES_KEY, variables.id] })
    },
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => companiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_KEY })
    },
  })
}
