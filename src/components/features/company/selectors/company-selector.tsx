'use client'

import { useRouter } from 'next/navigation'
import { usePermissions } from '@/lib/hooks/use-permissions'
import { useCompanyData } from '@/lib/hooks/data/use-company-data'
import { LoadingSpinner } from '@/components/shared/feedback/loading-spinner'
import { ErrorState } from '@/components/shared/feedback/error-state'
import { CompanySelectorView } from './company-selector-view'
import { EmptyCompanyState } from './empty-company-state'
import { cn } from '@/lib/utils'

interface CompanySelectorProps {
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'compact'
}

export function CompanySelector({
  className,
  showLabel = true,
  variant = 'default',
}: CompanySelectorProps) {
  const router = useRouter()
  const { isAdmin } = usePermissions()
  const { companies, selectedCompany, isLoading, error, selectCompany } = useCompanyData()

  if (!isAdmin) {
    return null
  }

  const handleCompanyChange = (companyId: string) => {
    if (companyId === 'new') {
      router.push('/companies/new')
      return
    }

    if (companyId === 'manage') {
      router.push('/companies')
      return
    }

    const company = companies.find((c) => c.id === companyId)
    if (company) {
      selectCompany(company)
    }
  }

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-2 px-1', className)}>
        <LoadingSpinner size="sm" />
        {showLabel && variant === 'default' && (
          <span className="text-xs text-muted-foreground truncate">Carregando...</span>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('px-1', className)}>
        <ErrorState
          message="Erro"
          onRetry={() => router.push('/companies')}
          retryLabel="Tentar"
          className="flex-col items-start gap-1"
        />
      </div>
    )
  }

  if (companies.length === 0) {
    return (
      <EmptyCompanyState
        onCreateCompany={() => router.push('/companies/new')}
        showLabel={showLabel}
        variant={variant}
        className={className}
      />
    )
  }

  return (
    <CompanySelectorView
      companies={companies}
      selectedCompany={selectedCompany}
      onCompanyChange={handleCompanyChange}
      onManage={() => router.push('/companies')}
      showLabel={showLabel}
      variant={variant}
      className={className}
    />
  )
}
