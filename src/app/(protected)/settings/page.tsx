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

      <div className="mt-6 space-y-6">
        {!effectiveCompanyId ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                Nenhuma empresa selecionada
              </CardTitle>
              <CardDescription>
                Selecione uma empresa no topo para visualizar as configurações de empresa, plano e
                administrador.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : isLoading ? (
          <div className="space-y-4">
            <div className="h-28 animate-pulse rounded-xl bg-muted/60" />
            <div className="h-40 animate-pulse rounded-xl bg-muted/60" />
          </div>
        ) : error || !data ? (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Não foi possível carregar as configurações
              </CardTitle>
              <CardDescription className="text-destructive">
                Tente atualizar a página ou voltar mais tarde.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <Card className="overflow-hidden border-2">
              <CardHeader className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      Plano {data.plan.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      Informações sobre seu plano e limites disponíveis
                    </CardDescription>
                  </div>
                  <Badge
                    variant={data.subscription.isActive ? 'default' : 'outline'}
                    className={
                      data.subscription.isActive
                        ? 'bg-emerald-600 px-4 py-1.5 text-sm font-semibold hover:bg-emerald-700'
                        : 'px-4 py-1.5 text-sm font-semibold'
                    }
                  >
                    {data.subscription.isActive ? 'Assinatura ativa' : 'Assinatura inativa'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

                <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold text-foreground">Informações da assinatura</p>
                    <p className="text-sm text-muted-foreground">
                      Iniciada em <span className="font-medium">{formatDate(data.subscription.startedAt)}</span>
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">
                      ID: {data.subscription.id}
                    </p>
                  </div>
                </div>

                {(platformSettings?.supportWhatsapp || platformSettings?.supportEmail) && (
                  <div className="flex flex-wrap gap-3 border-t border-border/50 pt-6">
                    <p className="w-full text-sm font-medium text-muted-foreground">
                      Precisa de mais recursos?
                    </p>
                    {platformSettings.supportWhatsapp && (
                      <a
                        href={`https://wa.me/${platformSettings.supportWhatsapp.replace('+', '')}?text=${encodeURIComponent('Olá! Gostaria de fazer um upgrade de plano no ToolDo.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Fazer upgrade via WhatsApp
                      </a>
                    )}
                    {platformSettings.supportEmail && (
                      <a
                        href={`mailto:${platformSettings.supportEmail}?subject=${encodeURIComponent('Upgrade de plano - ToolDo')}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-all hover:bg-muted hover:shadow-sm"
                      >
                        <Mail className="h-4 w-4" />
                        Falar por email
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {(isAdmin || isMaster) && (
              <Card className="border-2">
                <CardHeader className="bg-gradient-to-br from-blue-500/5 via-blue-500/3 to-transparent">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                      <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Notificações • Disparar job
                  </CardTitle>
                  <CardDescription className="text-base">
                    Dispara imediatamente o job de notificações de ações atrasadas (o mesmo que roda
                    automaticamente às 9h). Envia SMS e WhatsApp para os responsáveis com tarefas em
                    atraso.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Button
                    onClick={handleTriggerOverdue}
                    disabled={isPending}
                    size="lg"
                    className="gap-2"
                  >
                    {isPending ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                    {isPending ? 'Disparando...' : 'Disparar notificações agora'}
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
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <Icon className="h-4 w-4" />
              </div>
            )}
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
          </div>
          <p className="text-2xl font-bold text-foreground">{display}</p>
          {helper && (
            <p className="text-xs leading-relaxed text-muted-foreground">{helper}</p>
          )}
        </div>
      </div>
    </div>
  )
}
