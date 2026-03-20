export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR').format(dateObj)
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(dateObj)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const intervals = {
    ano: 31536000,
    mês: 2592000,
    semana: 604800,
    dia: 86400,
    hora: 3600,
    minuto: 60,
  }

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds)
    if (interval >= 1) {
      return `há ${interval} ${unit}${interval > 1 ? 's' : ''}`
    }
  }

  return 'agora mesmo'
}

export function formatRole(
  role: 'master' | 'admin' | 'manager' | 'executor' | 'consultant'
): string {
  const roles = {
    master: 'Master',
    admin: 'Administrador',
    manager: 'Gestor',
    executor: 'Executor',
    consultant: 'Consultor',
  }

  return roles[role]
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function formatCNPJ(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/** Display format: E.164 as +55 (DDD) XXXXX-XXXX, or legacy (DDD) XXXXX-XXXX */
export function formatPhone(phone: string): string {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  const withCode = cleaned.startsWith('55') ? cleaned : `55${cleaned}`
  if (withCode.length >= 12) {
    const rest = withCode.slice(2, 13)
    if (rest.length <= 2) return rest.length === 0 ? '+55' : `+55 (${rest})`
    if (rest.length <= 6) return `+55 (${rest.slice(0, 2)}) ${rest.slice(2)}`
    if (rest.length <= 10) return `+55 (${rest.slice(0, 2)}) ${rest.slice(2, 6)}-${rest.slice(6)}`
    return `+55 (${rest.slice(0, 2)}) ${rest.slice(2, 7)}-${rest.slice(7, 11)}`
  }
  if (cleaned.length === 11) return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  if (cleaned.length === 10) return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  return phone
}
