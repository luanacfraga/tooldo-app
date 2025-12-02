'use client'

import { AdminOnly } from '@/components/features/auth/guards/admin-only'
import { BaseLayout } from '@/components/layout/base-layout'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { EmptyState } from '@/components/shared/feedback/empty-state'
import { ErrorState } from '@/components/shared/feedback/error-state'
import { LoadingScreen } from '@/components/shared/feedback/loading-screen'
import { PageContainer } from '@/components/shared/layout/page-container'
import { PageHeader } from '@/components/shared/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCompanies } from '@/lib/services/queries'
import { useCompanyStore } from '@/lib/stores/company-store'
import { Building2, CheckCircle, Plus, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CompaniesPage() {
  const router = useRouter()
  const { data: companies = [], isLoading, error, refetch } = useCompanies()
  const { selectedCompany } = useCompanyStore()

  if (isLoading) {
    return (
      <AdminOnly>
        <BaseLayout sidebar={<DashboardSidebar />}>
          <LoadingScreen message="Carregando empresas..." />
        </BaseLayout>
      </AdminOnly>
    )
  }

  return (
    <AdminOnly>
      <BaseLayout sidebar={<DashboardSidebar />}>
        <PageContainer maxWidth="5xl">
          <PageHeader
            title="Minhas Empresas"
            description="Gerencie suas empresas"
            action={
              <Button
                onClick={() => router.push('/companies/new')}
                className="w-full sm:w-auto"
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Empresa
              </Button>
            }
          />

          {error && (
            <div className="mb-6">
              <ErrorState message="Erro ao carregar empresas" onRetry={() => refetch()} />
            </div>
          )}

          {!error && companies.length === 0 && (
            <EmptyState
              icon={Building2}
              title="Nenhuma empresa cadastrada"
              description="Você ainda não possui empresas cadastradas. Crie sua primeira empresa para gerenciar."
              action={{
                label: 'Criar Primeira Empresa',
                onClick: () => router.push('/companies/new'),
              }}
            />
          )}

          {!error && companies.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => {
                const isSelected = selectedCompany?.id === company.id

                return (
                  <Card key={company.id} className="group relative transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex-shrink-0 rounded-lg bg-primary-lightest p-2.5">
                            <Building2 className="h-5 w-5 text-primary-base" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="truncate text-base">{company.name}</CardTitle>
                            {isSelected && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-primary-base">
                                <CheckCircle className="h-3 w-3 flex-shrink-0" />
                                <span className="font-medium">Ativa</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => router.push(`/companies/${company.id}/edit`)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs">
                        ID: {company.id.slice(0, 8)}...
                      </CardDescription>
                      {company.description && (
                        <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                          {company.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </PageContainer>
      </BaseLayout>
    </AdminOnly>
  )
}
