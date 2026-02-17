'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useManagerDashboard } from '@/lib/hooks/use-manager-dashboard'
import { PeriodFilter } from '../shared/period-filter'
import { AttentionItemsByExecutor } from './attention-items-by-executor'
import { StatusPieChart } from '../shared/status-pie-chart'
import type { DatePreset } from '@/lib/utils/date-presets'
import { getPresetRange } from '@/lib/utils/period-comparator'
import { useState } from 'react'

type Props = {
  companyId: string
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: number
  highlight?: 'red' | 'orange'
}) {
  const valueClass =
    highlight === 'red'
      ? 'text-red-600'
      : highlight === 'orange'
        ? 'text-orange-500'
        : 'text-foreground'

  return (
    <div className="flex flex-col gap-1 rounded-xl border bg-card p-4 shadow-sm">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className={`text-2xl font-bold tabular-nums ${valueClass}`}>
        {value}
      </span>
    </div>
  )
}

export function ManagerDashboard({ companyId }: Props) {
  const [preset, setPreset] = useState<DatePreset>('este-mes')
  const { dateFrom, dateTo } = getPresetRange(preset)

  const { data, isLoading } = useManagerDashboard({ companyId, dateFrom, dateTo })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Carregando dashboard...
      </div>
    )
  }

  if (!data) return null

  const { teamTotals, attentionItems } = data

  return (
    <div className="flex flex-col gap-6">
      {/* Period filter */}
      <PeriodFilter selected={preset} onChange={setPreset} />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Pendentes" value={teamTotals.todo} />
        <StatCard label="Em andamento" value={teamTotals.inProgress} />
        <StatCard label="Concluídas" value={teamTotals.done} />
        <StatCard
          label="Atrasadas"
          value={teamTotals.late}
          highlight={teamTotals.late > 0 ? 'red' : undefined}
        />
      </div>

      {/* Gráfico + ações críticas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Status da equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPieChart
              title=""
              data={{
                todo: teamTotals.todo,
                inProgress: teamTotals.inProgress,
                done: teamTotals.done,
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Ações que precisam de atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AttentionItemsByExecutor attentionItems={attentionItems} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
