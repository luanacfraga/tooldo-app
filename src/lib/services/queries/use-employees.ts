import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { employeesApi } from '@/lib/api/endpoints/employees'
import type { InviteEmployeeRequest } from '@/lib/types/api'

const EMPLOYEES_KEY = ['employees'] as const

export function useEmployeesByCompany(companyId: string) {
  return useQuery({
    queryKey: [...EMPLOYEES_KEY, 'company', companyId],
    queryFn: async () => {
      const response = await employeesApi.listByCompany(companyId)
      return response.data || []
    },
    enabled: !!companyId,
  })
}

export function useInviteEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: InviteEmployeeRequest) => employeesApi.invite(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...EMPLOYEES_KEY, 'company', variables.companyId]
      })
    },
  })
}

export function useSuspendEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => employeesApi.suspend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY })
    },
  })
}

export function useActivateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => employeesApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY })
    },
  })
}

export function useRemoveEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => employeesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY })
    },
  })
}
