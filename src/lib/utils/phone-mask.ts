// tooldo-app/src/lib/utils/phone-mask.ts

export const PHONE_PLACEHOLDER = '(11) 91234-5678'

/** Extract only digit characters */
export function getDigits(s: string): string {
  return s.replace(/\D/g, '')
}

/**
 * Normalize raw input to at most 11 national digits.
 * Strips leading "55" if the result would exceed 11 digits (E.164 paste).
 */
export function normalizeDigits(input: string): string {
  let d = getDigits(input)
  if (d.startsWith('55') && d.length > 11) {
    d = d.slice(2)
  }
  return d.slice(0, 11)
}

/**
 * Format national digits for display:
 *   0–2 digits  → "(XX" partial
 *   3–6 digits  → "(XX) YYYY"
 *   7–10 digits → "(XX) YYYY-ZZZZ"  (landline style, 4+4)
 *   11 digits   → "(XX) 9YYYY-ZZZZ" (mobile, 5+4)
 */
export function formatDisplay(digits: string): string {
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  const ddd = digits.slice(0, 2)
  const num = digits.slice(2)
  if (num.length <= 4) return `(${ddd}) ${num}`
  if (num.length <= 8) return `(${ddd}) ${num.slice(0, 4)}-${num.slice(4)}`
  return `(${ddd}) ${num.slice(0, 5)}-${num.slice(5, 9)}`
}

/** Convert 10–11 national digits to E.164: +55XXXXXXXXXXX */
export function toE164(digits: string): string {
  if (digits.length < 10) return ''
  return `+55${digits}`
}

/** Count digits in `str` up to (not including) `position` */
export function countDigitsBefore(str: string, position: number): number {
  return getDigits(str.slice(0, position)).length
}

/** Find the character position after `digitCount` digits in `formatted` */
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

/**
 * Core masking logic. Called on every input event.
 * Works entirely with national digits (no country code in display).
 *
 * Three cases:
 *  - Synthetic delete: browser removed a formatting character (digit count unchanged,
 *    display length shortened). We synthesise removing the digit before the caret.
 *  - All other cases (digit typed, digit deleted, select-all+delete, selection delete,
 *    paste): use rawDigits directly.
 */
export function processPhoneInput(
  prevDisplay: string,
  prevCaret: number,
  rawValue: string,
  caret: number,
): ProcessPhoneInputResult {
  const prevDigits = getDigits(prevDisplay)
  const rawDigits = getDigits(rawValue)

  const isSyntheticDelete =
    rawDigits.length === prevDigits.length && rawValue.length < prevDisplay.length

  let nextDigits: string
  if (isSyntheticDelete) {
    // Backspace landed on a formatting char — remove the digit just left of the caret
    const indexToRemove = Math.max(0, countDigitsBefore(prevDisplay, prevCaret) - 1)
    nextDigits = prevDigits.slice(0, indexToRemove) + prevDigits.slice(indexToRemove + 1)
  } else {
    nextDigits = rawDigits
  }

  const normalized = normalizeDigits(nextDigits)
  const formatted = formatDisplay(normalized)

  const targetDigitCount = isSyntheticDelete
    ? Math.max(0, countDigitsBefore(prevDisplay, prevCaret) - 1)
    : countDigitsBefore(rawValue, caret)

  return {
    formatted,
    e164: toE164(normalized),
    targetDigitCount: Math.max(0, targetDigitCount),
  }
}
