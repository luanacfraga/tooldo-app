'use client'

import { ActivityItem } from '@/components/shared/feedback/activity-item'
import { LoadingSpinner } from '@/components/shared/feedback/loading-spinner'
import { PageHeader } from '@/components/shared/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCardWithComparison } from '@/components/features/dashboard/shared/metric-card-with-comparison'
import { PeriodFilter } from '@/components/features/dashboard/shared/period-filter'
import { PeriodIndicator } from '@/components/features/dashboard/shared/period-indicator'
import { useExecutorDashboard } from '@/lib/hooks/use-executor-dashboard'
import type { DatePreset } from '@/lib/utils/date-presets'
import { getPresetRange } from '@/lib/utils/period-comparator'
import { ActionPriority } from '@/lib/types/action'
import { cn } from '@/lib/utils'
import { Clock, ListTodo, ShieldAlert, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ExecutorDoneTrendChart } from './executor-done-trend-chart'

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '0%'
  return `${Math.round(value)}%`
}

function priorityToColor(priority: ActionPriority, isLate: boolean) {
  if (isLate) return 'red' as const
  switch (priority) {
    case ActionPriority.URGENT:
      return 'orange' as const
    case ActionPriority.HIGH:
      return 'purple' as const
    case ActionPriority.MEDIUM:
      return 'blue' as const
    case ActionPriority.LOW:
      return 'green' as const
  }
}

export function ExecutorDashboard(props: { companyId: string; className?: string }) {
  const [preset, setPreset] = useState<DatePreset>('esta-semana')
  const range = useMemo(() => getPresetRange(preset), [preset])

  const q = useExecutorDashboard({
    companyId: props.companyId,
    dateFrom: range.dateFrom,
    dateTo: range.dateTo,
  })

  const data = q.data

  return (
    <div className={cn('space-y-6', props.className)}>
      <PageHeader
        title="Meu desempenho"
        description="Acompanhe suas entregas e veja seu contexto dentro do time."
        rightContent={
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <PeriodFilter selected={preset} onChange={setPreset} />
            <PeriodIndicator preset={preset} />
          </div>
        }
      />

      {q.isLoading ? (
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner icon="logo" size="lg" variant="muted" label="Carregando dashboard..." />
        </div>
      ) : q.error ? (
        <Card>
          <CardHeader>
            <CardTitle>Não foi possível carregar</CardTitle>
            <CardDescription>Tente novamente em instantes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => q.refetch()}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : !data ? null : (
        <>
          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCardWithComparison
              title="Concluídas no período"
              value={data.doneInPeriod.current}
              comparison={{
                absolute: data.doneInPeriod.delta,
                percent: data.doneInPeriod.previous
                  ? Math.round((data.doneInPeriod.delta / data.doneInPeriod.previous) * 100)
                  : 0,
                isImprovement: data.doneInPeriod.delta >= 0,
              }}
              icon={TrendingUp}
              iconColor="text-primary"
              bgColor="bg-primary/10"
            />
            <MetricCardWithComparison
              title="Taxa de conclusão"
              value={formatPercent(data.completionRate)}
              icon={ListTodo}
              iconColor="text-success"
              bgColor="bg-success/10"
            />
            <MetricCardWithComparison
              title="Atrasadas"
              value={data.totals.late}
              icon={Clock}
              iconColor={data.totals.late > 0 ? 'text-warning' : 'text-muted-foreground'}
              bgColor={data.totals.late > 0 ? 'bg-warning/10' : 'bg-muted'}
            />
            <MetricCardWithComparison
              title="Bloqueadas"
              value={data.totals.blocked}
              icon={ShieldAlert}
              iconColor={data.totals.blocked > 0 ? 'text-warning' : 'text-muted-foreground'}
              bgColor={data.totals.blocked > 0 ? 'bg-warning/10' : 'bg-muted'}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
            <ExecutorDoneTrendChart
              className="lg:col-span-2"
              current={data.doneTrend.current}
              previous={data.doneTrend.previous}
            />

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Minha posição
                </CardTitle>
                <CardDescription>Contexto do time (sem expor ranking completo).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.team ? (
                  <>
                    <div className="text-sm">
                      Você é <span className="font-semibold">#{data.team.rank}</span> de{' '}
                      <span className="font-semibold">{data.team.totalMembers}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {data.team.percentDiffFromAverage >= 0 ? 'Acima' : 'Abaixo'} da média do time:{' '}
                      <span className="font-semibold text-foreground">
                        {Math.abs(Math.round(data.team.percentDiffFromAverage))}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Suas concluídas: {data.team.myDone} · Média: {data.team.averageDone.toFixed(1)}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Você ainda não está vinculado(a) a uma equipe.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Minhas próximas ações</CardTitle>
                <CardDescription>Priorize o próximo passo para avançar rápido.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/actions">Ver no Kanban</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.nextActions.length ? (
                <div className="space-y-4">
                  {data.nextActions.map((a) => (
                    <ActivityItem
                      key={a.id}
                      title={a.title}
                      description={
                        a.isBlocked ? 'Bloqueada' : a.isLate ? 'Atrasada' : a.priority.toLowerCase()
                      }
                      color={priorityToColor(a.priority, a.isLate)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sem próximas ações. Escolha uma pendente no Kanban para começar.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}


