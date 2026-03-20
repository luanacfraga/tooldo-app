'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { companiesApi } from '@/lib/api/endpoints/companies'
import type { ManagerDashboardResponse } from '@/lib/types/manager-dashboard'

export const managerDashboardKeys = {
  all: ['manager-dashboard'] as const,
  byCompany: (companyId: string, dateFrom?: string, dateTo?: string) =>
    [...managerDashboardKeys.all, companyId, dateFrom, dateTo] as const,
}

type UseManagerDashboardInput = {
  companyId: string
  dateFrom?: string
  dateTo?: string
}

export function useManagerDashboard({
  companyId,
  dateFrom,
  dateTo,
}: UseManagerDashboardInput): UseQueryResult<ManagerDashboardResponse, Error> {
  return useQuery({
    queryKey: managerDashboardKeys.byCompany(companyId, dateFrom, dateTo),
    queryFn: () =>
      companiesApi.getManagerDashboard(companyId, { dateFrom, dateTo }),
    enabled: !!companyId,
  })
}
