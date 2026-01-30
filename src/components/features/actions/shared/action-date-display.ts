import { Action, ActionStatus } from '@/lib/types/action'
import { format } from 'date-fns'

type ActionDateDisplay = {
  label: string
  tooltip: string
}

function formatSafe(dateString: string | null | undefined, pattern = 'dd/MM'): string | null {
  if (!dateString) return null
  const trimmed = dateString.trim()
  // Extrai YYYY-MM-DD (datas da API vêm como ISO "2025-01-30T00:00:00.000Z" ou "2025-01-30")
  const datePart = trimmed.slice(0, 10)
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart)
  const date = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3])
      )
    : new Date(trimmed)
  if (Number.isNaN(date.getTime())) return null
  return format(date, pattern)
}

export function getActionDateDisplay(action: Action): ActionDateDisplay {
  const estStart = formatSafe(action.estimatedStartDate)
  const estEnd = formatSafe(action.estimatedEndDate)
  const actualStart = formatSafe(action.actualStartDate)
  const actualEnd = formatSafe(action.actualEndDate)

  const fallbackLabel = estStart && estEnd ? `${estStart} - ${estEnd}` : estEnd || estStart || '—'

  if (action.status === ActionStatus.TODO) {
    if (estStart && estEnd) {
      return {
        label: `${estStart} - ${estEnd} (previsão)`,
        tooltip: 'Início previsto e fim previsto',
      }
    }
    return {
      label: `${fallbackLabel} (previsão)`,
      tooltip: 'Datas previstas',
    }
  }

  if (action.status === ActionStatus.IN_PROGRESS) {
    if (actualStart && estEnd) {
      return {
        label: `${actualStart} (real) - ${estEnd} (previsão)`,
        tooltip: 'Início real e fim previsto',
      }
    }

    if (estStart && estEnd) {
      return {
        label: `${estStart} - ${estEnd} (previsão)`,
        tooltip: 'Início previsto e fim previsto',
      }
    }

    return {
      label: fallbackLabel,
      tooltip: 'Período da ação',
    }
  }

  if (actualStart && actualEnd) {
    return {
      label: `${actualStart} - ${actualEnd}`,
      tooltip: 'Início real e fim real',
    }
  }

  if (actualStart && !actualEnd) {
    return {
      label: `${actualStart} - —`,
      tooltip: 'Início real, fim ainda não informado',
    }
  }

  return {
    label: fallbackLabel,
    tooltip: 'Período da ação',
  }
}
