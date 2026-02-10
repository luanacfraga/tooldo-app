'use client'

import * as React from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'
import {
  PHONE_PLACEHOLDER,
  processPhoneInput,
  formatDisplay,
  normalizeDigits,
  caretAfterDigitCount,
} from '@/lib/utils/phone-mask'

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string
  onChange?: (value: string) => void
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = '', onChange, placeholder: _placeholder, ...props }, ref) => {
    const [display, setDisplay] = React.useState('')
    const prevDisplayRef = React.useRef('')
    const prevCaretRef = React.useRef<number | null>(null)

    React.useEffect(() => {
      const digits = normalizeDigits(value)
      const next = formatDisplay(digits)
      setDisplay((prev) => (prev === next ? prev : next))
    }, [value])

    React.useEffect(() => {
      prevDisplayRef.current = display
    }, [display])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target
      const rawValue = input.value
      const caret = input.selectionStart ?? rawValue.length
      const prevDisplay = prevDisplayRef.current
      const prevCaret = prevCaretRef.current ?? caret

      const { formatted, e164, targetDigitCount } = processPhoneInput(
        prevDisplay,
        prevCaret,
        rawValue,
        caret
      )

      setDisplay(formatted)
      onChange?.(e164)

      requestAnimationFrame(() => {
        const pos = caretAfterDigitCount(formatted, targetDigitCount)
        input.setSelectionRange(pos, pos)
        prevCaretRef.current = pos
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
        placeholder={PHONE_PLACEHOLDER}
        className={cn(className)}
        {...props}
      />
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
