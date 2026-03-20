export type ManagerDashboardTeamTotals = {
  total: number
  todo: number
  inProgress: number
  done: number
  late: number
  blocked: number
}

export type ManagerDashboardAttentionAction = {
  id: string
  title: string
  reason: 'BLOCKED' | 'LATE'
  lateStatus: string | null
  isBlocked: boolean
  priority: string
  estimatedEndDate: string | null
}

export type ManagerDashboardAttentionExecutor = {
  userId: string
  name: string
  avatarUrl: string | null
  avatarColor: string | null
  criticalCount: number
  actions: ManagerDashboardAttentionAction[]
}

export type ManagerDashboardResponse = {
  companyId: string
  managerId: string
  teamTotals: ManagerDashboardTeamTotals
  attentionItems: ManagerDashboardAttentionExecutor[]
}
