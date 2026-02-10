const COUNTRY_CODE = '55'
const NATIONAL_LENGTH = 11
const MAX_LENGTH = COUNTRY_CODE.length + NATIONAL_LENGTH

export const PHONE_PLACEHOLDER = '+55 (DDD) XXXXX-XXXX'

export function getDigits(s: string): string {
  return s.replace(/\D/g, '')
}

export function countDigitsBefore(str: string, position: number): number {
  return getDigits(str.slice(0, position)).length
}

export function normalizeDigits(input: string): string {
  const digits = getDigits(input)
  const withCode = digits.startsWith(COUNTRY_CODE) ? digits : COUNTRY_CODE + digits
  return withCode.slice(0, MAX_LENGTH)
}

export function formatDisplay(digits: string): string {
  if (!digits) return ''
  const rest = digits.slice(2)
  if (!rest) return '+55'

  const ddd = rest.slice(0, 2)
  const number = rest.slice(2)

  if (number.length <= 4) return `+55 (${ddd}) ${number}`
  if (number.length <= 8) return `+55 (${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`
  return `+55 (${ddd}) ${number.slice(0, 5)}-${number.slice(5, 9)}`
}

export function toE164(digits: string): string {
  return digits.length === MAX_LENGTH ? `+${digits}` : ''
}

export function caretAfterDigitCount(formatted: string, digitCount: number): number {
  let pos = 0
  let seen = 0
  while (pos < formatted.length && seen < digitCount) {
    if (/\d/.test(formatted[pos])) seen++
    pos++
  }
  return pos
}

export interface ProcessPhoneInputResult {
  formatted: string
  e164: string
  targetDigitCount: number
}

export function processPhoneInput(
  prevDisplay: string,
  prevCaret: number,
  rawValue: string,
  caret: number
): ProcessPhoneInputResult {
  const prevDigits = getDigits(prevDisplay)
  let nextDigits = getDigits(rawValue)
  const digitsBeforeCaret = countDigitsBefore(prevDisplay, prevCaret)

  if (nextDigits.length < prevDigits.length - 1) {
    const indexToRemove = Math.max(0, digitsBeforeCaret - 1)
    nextDigits =
      prevDigits.slice(0, indexToRemove) + prevDigits.slice(indexToRemove + 1)
  }

  const normalized = normalizeDigits(nextDigits)
  const formatted = formatDisplay(normalized)
  const targetDigitCount =
    nextDigits.length < prevDigits.length - 1
      ? digitsBeforeCaret - 1
      : countDigitsBefore(rawValue, caret)

  return {
    formatted,
    e164: toE164(normalized),
    targetDigitCount,
  }
}
