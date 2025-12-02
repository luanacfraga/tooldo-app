'use client'

import { AdminOnly } from '@/components/features/auth/guards/admin-only'
import { BaseLayout } from '@/components/layout/base-layout'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { ErrorState } from '@/components/shared/feedback/error-state'
import { LoadingScreen } from '@/components/shared/feedback/loading-screen'
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
        <div className="container mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Minhas Empresas</h1>
                <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2">
                  Gerencie suas empresas
                </p>
              </div>
              <Button
                onClick={() => router.push('/companies/new')}
                className="w-full sm:w-auto"
                size="lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nova Empresa
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorState message="Erro ao carregar empresas" onRetry={() => refetch()} />
            </div>
          )}

          {!error && companies.length === 0 && (
            <Card className="animate-fade-in">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-muted p-6">
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">Nenhuma empresa cadastrada</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Você ainda não possui empresas cadastradas.
                  <br />
                  Crie sua primeira empresa para gerenciar.
                </p>
                <Button onClick={() => router.push('/companies/new')} className="mt-6" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Empresa
                </Button>
              </CardContent>
            </Card>
          )}

          {!error && companies.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => {
                const isSelected = selectedCompany?.id === company.id

                return (
                  <Card key={company.id} className="group relative transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary-lightest p-2.5">
                            <Building2 className="h-5 w-5 text-primary-base" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{company.name}</CardTitle>
                            {isSelected && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-primary-base">
                                <CheckCircle className="h-3 w-3" />
                                <span className="font-medium">Ativa</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
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
        </div>
      </BaseLayout>
    </AdminOnly>
  )
}
