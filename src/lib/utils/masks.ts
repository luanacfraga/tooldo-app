export function maskPhone(value: string): string {
  const numbers = value.replace(/\D/g, '')

  if (numbers.length <= 2) {
    return numbers ? `(${numbers}` : numbers
  }

  const isMobile = numbers.length > 2 && numbers[2] === '9'

  if (isMobile) {
    if (numbers.length <= 3) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    }
    if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3)}`
    }
    if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7)}`
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  }
  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`
}

export function maskCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 14)
  
  if (numbers.length <= 2) {
    return numbers
  }
  
  if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
  }
  
  if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
  }
  
  if (numbers.length <= 12) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
  }
  
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`
}

export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, '')
}

/** Brazilian E.164: +55 + DDD + number. Accepts digits or E.164 string. */
export function toE164(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return ''
  const withCode = digits.startsWith('55') ? digits : `55${digits}`
  const limited = withCode.slice(0, 13) // 55 + 11
  return limited.length >= 12 ? `+${limited}` : `+${limited}`
}

/** Display format for E.164 BR: +55 (DDD) XXXXX-XXXX */
export function maskPhoneE164(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return ''
  const withCode = digits.startsWith('55') ? digits : `55${digits}`
  const rest = withCode.slice(2)
  if (rest.length <= 2) return rest.length === 0 ? '+55' : `+55 (${rest})`
  if (rest.length <= 6) return `+55 (${rest.slice(0, 2)}) ${rest.slice(2)}`
  if (rest.length <= 10) return `+55 (${rest.slice(0, 2)}) ${rest.slice(2, 6)}-${rest.slice(6)}`
  return `+55 (${rest.slice(0, 2)}) ${rest.slice(2, 7)}-${rest.slice(7, 11)}`
}

export function maskCPF(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11)
  
  if (numbers.length <= 3) {
    return numbers
  }
  
  if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  }
  
  if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  }
  
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`
}

export function unmaskCPF(value: string): string {
  return value.replace(/\D/g, '')
}

export function unmaskCNPJ(value: string): string {
  return value.replace(/\D/g, '')
}

