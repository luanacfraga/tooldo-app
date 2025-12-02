'use client'

import { RequireCompany } from '@/components/features/auth/guards/require-company'
import { BaseLayout } from '@/components/layout/base-layout'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { PageHeader } from '@/components/shared/layout/page-header'
import { PageContainer } from '@/components/shared/layout/page-container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/lib/stores/auth-store'
import { BarChart3, Building2, Users, CheckSquare } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const stats = [
    {
      title: 'Empresas',
      value: '2',
      icon: Building2,
      description: 'Total de empresas',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      title: 'Funcionários',
      value: '12',
      icon: Users,
      description: 'Ativos no sistema',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      title: 'Tarefas',
      value: '24',
      icon: CheckSquare,
      description: 'Em andamento',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    },
    {
      title: 'Performance',
      value: '94%',
      icon: BarChart3,
      description: 'Taxa de conclusão',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ]

  return (
    <RequireCompany>
      <BaseLayout sidebar={<DashboardSidebar />}>
        <PageContainer maxWidth="7xl">
          <PageHeader
            title={`Olá, ${user?.name?.split(' ')[0] || 'Usuário'}!`}
            description="Bem-vindo ao painel de controle"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {stats.map((stat) => (
              <Card key={stat.title} className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Últimas atualizações do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Nova empresa cadastrada</p>
                      <p className="text-sm text-muted-foreground">Há 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Funcionário convidado</p>
                      <p className="text-sm text-muted-foreground">Há 5 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Tarefa concluída</p>
                      <p className="text-sm text-muted-foreground">Há 1 dia</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximas Ações</CardTitle>
                <CardDescription>Tarefas pendentes importantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckSquare className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Revisar documentação</p>
                      <p className="text-sm text-muted-foreground">Prazo: Hoje</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckSquare className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Aprovar convites pendentes</p>
                      <p className="text-sm text-muted-foreground">Prazo: Amanhã</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckSquare className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Atualizar informações da empresa</p>
                      <p className="text-sm text-muted-foreground">Prazo: Esta semana</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageContainer>
      </BaseLayout>
    </RequireCompany>
  )
}
