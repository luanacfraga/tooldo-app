'use client'

import { LoadingScreen } from '@/components/shared/feedback/loading-screen'

import { useDashboardRedirect } from '@/lib/hooks/navigation/use-dashboard-redirect'

export default function DashboardPage() {
  useDashboardRedirect()

  return <LoadingScreen message="Redirecionando..." />
}
