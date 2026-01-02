'use client'

import { ActionFilters } from '@/components/features/actions/action-list/action-filters'
import { ActionListContainer } from '@/components/features/actions/action-list/action-list-container'
import { ActionListSkeleton } from '@/components/features/actions/action-list/action-list-skeleton'
import { PageContainer } from '@/components/shared/layout/page-container'
import { PageHeader } from '@/components/shared/layout/page-header'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/hooks/use-auth'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export default function ActionsPage() {
  const { user } = useAuth()
  const canCreate = user?.role === 'admin' || user?.role === 'manager'

  return (
    <PageContainer maxWidth="full" className="px-0 sm:px-0">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <PageHeader
          title="Ações"
          description="Gerencie e acompanhe o progresso das suas tarefas"
          action={
            canCreate ? (
              <Button asChild>
                <Link href="/actions/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Ação
                </Link>
              </Button>
            ) : null
          }
        />
      </div>

      <div className="space-y-6 px-4 sm:px-6">
        <ActionFilters />
        <Suspense fallback={<ActionListSkeleton />}>
          <ActionListContainer />
        </Suspense>
      </div>
    </PageContainer>
  )
}
