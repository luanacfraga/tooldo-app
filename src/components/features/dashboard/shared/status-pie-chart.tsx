'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type StatusPieChartData = {
  todo: number
  inProgress: number
  done: number
}

type StatusPieChartProps = {
  data: StatusPieChartData
  title: string
}

const SLICES = [
  { key: 'todo' as const, label: 'Pendentes', color: '#94a3b8' },
  { key: 'inProgress' as const, label: 'Em andamento', color: '#3b82f6' },
  { key: 'done' as const, label: 'Concluídas', color: '#22c55e' },
]

export function StatusPieChart({ data, title }: StatusPieChartProps) {
  const total = data.todo + data.inProgress + data.done
  const chartData = SLICES.map((s) => ({ ...s, value: data[s.key] })).filter(
    (d) => d.value > 0,
  )

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>

      {total === 0 ? (
        <div className="flex h-[160px] items-center justify-center text-sm text-muted-foreground">
          Nenhuma ação encontrada
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={64}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, _: string, props: { payload?: { label?: string } }) => [
                  value,
                  props.payload?.label ?? '',
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col gap-2">
            {SLICES.map((s) => (
              <div key={s.key} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="ml-auto text-xs font-semibold tabular-nums">
                  {data[s.key]}
                </span>
              </div>
            ))}
            <div className="mt-1 border-t pt-1 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="ml-auto text-xs font-bold tabular-nums">{total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
