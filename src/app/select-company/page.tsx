'use client'

import { AdminOnly } from '@/components/features/auth/guards/admin-only'
import { HeaderMenu } from '@/components/layout/header-menu'
import { LoadingScreen } from '@/components/shared/feedback/loading-screen'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCompanies } from '@/lib/services/queries'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useCompanyStore } from '@/lib/stores/company-store'
import type { Company } from '@/lib/types/api'
import { AlertCircle, ArrowRight, Building2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SelectCompanyPage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const { data: companies = [], isLoading, error } = useCompanies()
  const { selectedCompany, selectCompany } = useCompanyStore()

  const handleSelectCompany = (company: Company) => {
    selectCompany(company)
    router.push('/dashboard')
  }

  const handleCompanySelect = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId)
    if (company) {
      handleSelectCompany(company)
    }
  }

  if (isLoading) {
    return (
      <AdminOnly>
        <div className="flex min-h-screen flex-col bg-background">
          <HeaderMenu />
          <LoadingScreen message="Carregando empresas..." />
        </div>
      </AdminOnly>
    )
  }

  return (
    <AdminOnly>
      <div className="flex min-h-screen flex-col bg-background">
        <HeaderMenu />
        <div className="flex flex-1 items-center justify-center pt-16 sm:pt-20">
          <div className="w-full max-w-4xl px-6">
            <div className="mb-16 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Olá, {user?.name?.split(' ')[0] || 'Admin'}
              </h1>
              <p className="mt-2 text-muted-foreground">
                Selecione ou crie uma empresa para gerenciar
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">
                    Erro ao carregar empresas. Tente novamente.
                  </p>
                </div>
              </div>
            )}

            {!error && (
              <div className="grid gap-8 md:grid-cols-2">
                <Card className="border border-border bg-card transition-colors hover:border-primary/50">
                  <CardContent className="flex flex-col p-8">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted/50">
                      <Plus className="h-5 w-5 text-foreground" />
                    </div>
                    <CardTitle className="mb-2 text-xl font-semibold">Nova Empresa</CardTitle>
                    <CardDescription className="mb-6 text-sm">
                      Crie uma nova empresa para começar a gerenciar sua equipe
                    </CardDescription>
                    <Button
                      onClick={() => router.push('/companies/new?redirect=/select-company')}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Cadastrar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-border bg-card">
                  <CardContent className="p-8">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted/50">
                      <Building2 className="h-5 w-5 text-foreground" />
                    </div>
                    <CardTitle className="mb-2 text-xl font-semibold">Selecionar Empresa</CardTitle>
                    <CardDescription className="mb-6 text-sm">
                      Escolha uma empresa existente
                    </CardDescription>

                    {companies.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">Nenhuma empresa cadastrada</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Select
                          value={selectedCompany?.id || ''}
                          onValueChange={handleCompanySelect}
                        >
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Selecione uma empresa">
                              {selectedCompany?.name || 'Selecione uma empresa'}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          onClick={() => {
                            if (selectedCompany) {
                              handleSelectCompany(selectedCompany)
                            }
                          }}
                          disabled={!selectedCompany}
                          className="w-full"
                          size="lg"
                        >
                          {selectedCompany ? (
                            <>
                              Continuar
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            'Selecione uma empresa'
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminOnly>
  )
}
