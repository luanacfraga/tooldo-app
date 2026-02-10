'use client'

import * as React from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

const COUNTRY_CODE = '55'
const NATIONAL_LENGTH = 11 // DDD (2) + number (9)
const MAX_LENGTH = COUNTRY_CODE.length + NATIONAL_LENGTH

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** E.164 when complete, e.g. +5511999999999. Empty string when incomplete. */
  value?: string
  onChange?: (value: string) => void
}

/** Extract digits and force Brazil country code. Single source of truth. */
function normalizeDigits(input: string): string {
  const digits = input.replace(/\D/g, '')
  const withCode = digits.startsWith(COUNTRY_CODE) ? digits : COUNTRY_CODE + digits
  return withCode.slice(0, MAX_LENGTH)
}

/** Format digits for display: +55 (DDD) XXXXX-XXXX */
function formatDisplay(digits: string): string {
  if (!digits) return ''

  const rest = digits.slice(2)
  if (!rest) return '+55'

  const ddd = rest.slice(0, 2)
  const number = rest.slice(2)

  if (number.length <= 4) return `+55 (${ddd}) ${number}`
  if (number.length <= 8)
    return `+55 (${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`
  return `+55 (${ddd}) ${number.slice(0, 5)}-${number.slice(5, 9)}`
}

/** Return valid E.164 only when complete; otherwise empty string. */
function toE164(digits: string): string {
  return digits.length === MAX_LENGTH ? `+${digits}` : ''
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = '', onChange, placeholder: _placeholder, ...props }, ref) => {
    const [display, setDisplay] = React.useState('')

    React.useEffect(() => {
      const digits = normalizeDigits(value)
      const next = formatDisplay(digits)
      setDisplay((prev) => (prev === next ? prev : next))
    }, [value])

    // Caret is restored by digit count so delete/backspace behave naturally.
    // Not handled: selection delete, IME composition, undo/redo. Use a library if needed.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target
      const rawValue = input.value
      const selectionStart = input.selectionStart ?? rawValue.length

      const digitsBeforeCaret = rawValue
        .slice(0, selectionStart)
        .replace(/\D/g, '').length

      const digits = normalizeDigits(rawValue)
      const formatted = formatDisplay(digits)

      setDisplay(formatted)
      onChange?.(toE164(digits))

      requestAnimationFrame(() => {
        let caret = 0
        let digitCount = 0
        while (caret < formatted.length && digitCount < digitsBeforeCaret) {
          if (/\d/.test(formatted[caret])) digitCount++
          caret++
        }
        input.setSelectionRange(caret, caret)
      })
    }

    return (
      <Input
        ref={ref}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        value={display}
        onChange={handleChange}
        placeholder="+55 (DDD) XXXXX-XXXX"
        className={cn(className)}
        {...props}
      />
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
