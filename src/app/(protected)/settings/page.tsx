'use client'

import { PageContainer } from '@/components/shared/layout/page-container'
import { PageHeader } from '@/components/shared/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUserContext } from '@/lib/contexts/user-context'
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters'
import { usePermissions } from '@/lib/hooks/use-permissions'
import { useCompanySettings } from '@/lib/services/queries/use-companies'
import { useTriggerOverdueNotifications } from '@/lib/services/queries/use-notifications'
import { usePlatformSettings } from '@/lib/services/queries/use-platform-settings'
import {
  AlertCircle,
  Building2,
  Layers,
  Mail,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Users,
  UserCog,
  UserCheck,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'

export default function GlobalSettingsPage() {
  const { user, currentCompanyId } = useUserContext()
  const { isAdmin, isMaster } = usePermissions()
  const { mutate: triggerOverdue, isPending } = useTriggerOverdueNotifications()
  const { data: platformSettings } = usePlatformSettings()

  const fallbackCompanyId = user?.companies[0]?.id ?? null
  const effectiveCompanyId = currentCompanyId ?? fallbackCompanyId

  const { data, isLoading, error } = useCompanySettings(effectiveCompanyId || '')

  function handleTriggerOverdue() {
    triggerOverdue(undefined, {
      onSuccess: () => toast.success('Job de notificações disparado com sucesso!'),
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Erro ao disparar notificações'
        toast.error(msg)
      },
    })
  }

  const companyName =
    user?.companies.find((c) => c.id === effectiveCompanyId)?.name ??
    data?.company.name ??
    undefined

  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Plano e limites do grupo"
        description="Plano atual vinculado ao administrador e limites globais para todas as empresas."
      />

      <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
        {!effectiveCompanyId ? (
          <Card className="overflow-hidden">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex flex-wrap items-center gap-2 text-lg sm:text-xl">
                <AlertCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
                Nenhuma empresa selecionada
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Selecione uma empresa no topo para visualizar as configurações de empresa, plano e
                administrador.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="h-24 min-w-0 animate-pulse rounded-xl bg-muted/60 sm:h-28" />
            <div className="h-32 min-w-0 animate-pulse rounded-xl bg-muted/60 sm:h-40" />
          </div>
        ) : error || !data ? (
          <Card className="overflow-hidden border-destructive/40 bg-destructive/5">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex flex-wrap items-center gap-2 text-destructive text-lg sm:text-xl">
                <AlertCircle className="h-5 w-5 shrink-0" />
                Não foi possível carregar as configurações
              </CardTitle>
              <CardDescription className="text-destructive text-sm sm:text-base">
                Tente atualizar a página ou voltar mais tarde.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <Card className="overflow-hidden border-2">
              <CardHeader className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent px-4 pb-4 pt-4 sm:px-6 sm:pb-4 sm:pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <CardTitle className="flex flex-wrap items-center gap-2 text-xl sm:gap-3 sm:text-2xl">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
                        <Layers className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                      </div>
                      <span className="break-words">Plano {data.plan.name}</span>
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Informações sobre seu plano e limites disponíveis
                    </CardDescription>
                  </div>
                  <Badge
                    variant={data.subscription.isActive ? 'default' : 'outline'}
                    className={
                      data.subscription.isActive
                        ? 'w-fit bg-emerald-600 px-3 py-1 text-xs font-semibold hover:bg-emerald-700 sm:px-4 sm:py-1.5 sm:text-sm'
                        : 'w-fit px-3 py-1 text-xs font-semibold sm:px-4 sm:py-1.5 sm:text-sm'
                    }
                  >
                    {data.subscription.isActive ? 'Assinatura ativa' : 'Assinatura inativa'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-4 pt-4 sm:space-y-6 sm:px-6 sm:pt-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                  <PlanLimitItem
                    label="Empresas"
                    value={data.plan.maxCompanies}
                    helper="Máximo de empresas que este admin pode criar."
                    icon={Building2}
                  />
                  <PlanLimitItem
                    label="Gestores"
                    value={data.plan.maxManagers}
                    helper="Total de gestores somando todas as empresas."
                    icon={UserCog}
                  />
                  <PlanLimitItem
                    label="Executores"
                    value={data.plan.maxExecutors}
                    helper="Total de executores somando todas as empresas."
                    icon={Users}
                  />
                  <PlanLimitItem
                    label="Consultores"
                    value={data.plan.maxConsultants}
                    helper="Total de consultores somando todas as empresas."
                    icon={UserCheck}
                  />
                  <PlanLimitItem
                    label="Limite de IA"
                    value={data.plan.iaCallsLimit}
                    helper="Tokens / chamadas de IA disponíveis na assinatura."
                    format="number"
                    icon={Zap}
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-3 sm:flex-row sm:items-start sm:gap-3 sm:p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-semibold text-foreground">Informações da assinatura</p>
                    <p className="break-words text-sm text-muted-foreground">
                      Iniciada em <span className="font-medium">{formatDate(data.subscription.startedAt)}</span>
                    </p>
                    <p className="truncate text-xs font-mono text-muted-foreground sm:max-w-full">
                      ID: {data.subscription.id}
                    </p>
                  </div>
                </div>

                {(platformSettings?.supportWhatsapp || platformSettings?.supportEmail) && (
                  <div className="flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:pt-6">
                    <p className="text-sm font-medium text-muted-foreground">
                      Precisa de mais recursos?
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                      {platformSettings.supportWhatsapp && (
                        <a
                          href={`https://wa.me/${platformSettings.supportWhatsapp.replace('+', '')}?text=${encodeURIComponent('Olá! Gostaria de fazer um upgrade de plano no ToolDo.')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md sm:inline-flex"
                        >
                          <MessageCircle className="h-4 w-4 shrink-0" />
                          Fazer upgrade via WhatsApp
                        </a>
                      )}
                      {platformSettings.supportEmail && (
                        <a
                          href={`mailto:${platformSettings.supportEmail}?subject=${encodeURIComponent('Upgrade de plano - ToolDo')}`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-all hover:bg-muted hover:shadow-sm sm:inline-flex"
                        >
                          <Mail className="h-4 w-4 shrink-0" />
                          Falar por email
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {(isAdmin || isMaster) && (
              <Card className="border-2 overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-blue-500/5 via-blue-500/3 to-transparent px-4 sm:px-6">
                  <CardTitle className="flex flex-wrap items-center gap-2 text-lg sm:gap-3 sm:text-xl">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 sm:h-10 sm:w-10">
                      <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400 sm:h-5 sm:w-5" />
                    </div>
                    <span className="break-words">Notificações • Disparar job</span>
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm leading-relaxed sm:text-base">
                    Dispara imediatamente o job de notificações de ações atrasadas (o mesmo que roda
                    automaticamente às 9h). Envia SMS e WhatsApp para os responsáveis com tarefas em
                    atraso.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pt-4 sm:px-6 sm:pt-6">
                  <Button
                    onClick={handleTriggerOverdue}
                    disabled={isPending}
                    size="lg"
                    className="w-full gap-2 sm:w-auto"
                  >
                    {isPending ? (
                      <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
                    ) : (
                      <MessageSquare className="h-4 w-4 shrink-0" />
                    )}
                    <span className="truncate">{isPending ? 'Disparando...' : 'Disparar notificações agora'}</span>
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </PageContainer>
  )
}

interface PlanLimitItemProps {
  label: string
  value: number
  helper?: string
  format?: 'number' | 'currency'
  icon?: React.ComponentType<{ className?: string }>
}

function PlanLimitItem({ label, value, helper, format = 'number', icon: Icon }: PlanLimitItemProps) {
  const display = format === 'currency' ? formatCurrency(value) : formatNumber(value)

  return (
    <div className="group relative min-w-0 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 p-3 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:p-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20 sm:h-8 sm:w-8">
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            )}
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
          </div>
          <p className="text-xl font-bold text-foreground sm:text-2xl">{display}</p>
          {helper && (
            <p className="text-xs leading-relaxed text-muted-foreground">{helper}</p>
          )}
        </div>
      </div>
    </div>
  )
}
