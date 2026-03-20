'use client'

import { Building2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import { CreateCompanyModal } from '@/components/features/company/create-company-modal'
import { ErrorState } from '@/components/shared/feedback/error-state'
import { LoadingSpinner } from '@/components/shared/feedback/loading-spinner'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { useCompanyData } from '@/lib/hooks/data/use-company-data'
import { usePermissions } from '@/lib/hooks/use-permissions'
import { cn } from '@/lib/utils'
import { CompanySelectorView } from './company-selector-view'
import { EmptyCompanyState } from './empty-company-state'

interface CompanySelectorProps {
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'compact'
  isCollapsed?: boolean
}

export function CompanySelector({
  className,
  showLabel = true,
  variant = 'default',
  isCollapsed = false,
}: CompanySelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAdmin } = usePermissions()
  const { companies, selectedCompany, isLoading, error, selectCompany, refetch } = useCompanyData()
  const [createModalOpen, setCreateModalOpen] = useState(false)

  if (!isAdmin) {
    return null
  }

  const handleCompanyChange = (companyId: string) => {
    if (companyId === 'new') {
      setCreateModalOpen(true)
      return
    }

    if (companyId === 'manage') {
      router.push('/companies')
      return
    }

    const company = companies.find((c) => c.id === companyId)
    if (company) {
      selectCompany(company)

      const companyRoutePattern = /^\/companies\/([^/]+)(\/.*)?$/
      const match = pathname.match(companyRoutePattern)

      if (match) {
        const currentPath = match[2] || '/dashboard'
        router.push(`/companies/${companyId}${currentPath}`)
      } else {
        router.push(`/companies/${companyId}/dashboard`)
      }
    }
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          'flex items-center justify-center gap-2',
          isCollapsed ? 'px-0' : 'px-1',
          className
        )}
      >
        <LoadingSpinner size="sm" />
        {!isCollapsed && showLabel && variant === 'default' && (
          <span className="truncate text-xs text-muted-foreground">Carregando...</span>
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
    if (isCollapsed) {
      return (
        <div className={cn('flex items-center justify-center', className)}>
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </div>
      )
    }
    return (
      <>
        <EmptyCompanyState
          onCreateCompany={() => setCreateModalOpen(true)}
          showLabel={showLabel}
          variant={variant}
          className={className}
        />
        <CreateCompanyModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSuccess={() => {
            refetch?.()
            setCreateModalOpen(false)
          }}
        />
      </>
    )
  }

  if (isCollapsed) {
    return (
      <div className={cn('flex w-full items-center justify-center', className)}>
        <Select value={selectedCompany?.id || ''} onValueChange={handleCompanyChange}>
          <SelectTrigger className="flex h-10 w-10 items-center justify-center rounded-lg border-0 bg-transparent p-0 transition-all duration-200 hover:border-0 hover:bg-muted/50 hover:ring-0 focus:ring-0 focus:ring-offset-0 [&>span]:!hidden [&>svg:first-child]:mx-auto [&_svg:last-child]:!hidden">
            <Building2
              className={cn(
                'h-5 w-5 transition-colors',
                selectedCompany ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </SelectTrigger>
          <SelectContent className="z-[100] min-w-[220px]">
            {companies.map((company) => {
              const isSelected = selectedCompany?.id === company.id
              return (
                <SelectItem key={company.id} value={company.id}>
                  <div className="flex min-w-0 items-center gap-2">
                    <Building2
                      className={cn(
                        'h-4 w-4 flex-shrink-0',
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                    <span className={cn('truncate', isSelected && 'font-medium')}>
                      {company.name}
                    </span>
                    {isSelected && (
                      <span className="ml-auto h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <>
      <CompanySelectorView
        companies={companies}
        selectedCompany={selectedCompany}
        onCompanyChange={handleCompanyChange}
        onManage={() => router.push('/companies')}
        showLabel={showLabel}
        variant={variant}
        className={className}
      />
      <CreateCompanyModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => {
          refetch?.()
          setCreateModalOpen(false)
        }}
      />
    </>
  )
}
