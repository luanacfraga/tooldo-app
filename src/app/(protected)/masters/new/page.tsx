'use client'

import { MasterOnly } from '@/components/features/auth/guards/master-only'
import { LoadingScreen } from '@/components/shared/feedback/loading-screen'
import { PageContainer } from '@/components/shared/layout/page-container'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NewMasterUserPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/masters?create=1')
  }, [router])

  return (
    <MasterOnly>
      <PageContainer maxWidth="lg">
        <LoadingScreen message="Redirecionando..." />
      </PageContainer>
    </MasterOnly>
  )
}
