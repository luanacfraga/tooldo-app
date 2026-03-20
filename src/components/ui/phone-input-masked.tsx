'use client'

import { IMaskInput } from 'react-imask'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Brazil phone mask: +55 (XXX) XXXXX-XXXX
 * - Country code +55 is fixed (not configurable).
 * - Display: formatted with spaces and parentheses.
 * - Stored value: E.164 string with digits only, e.g. "+5511999999999".
 *
 * Raw digits extraction:
 * - The mask has 12 digit placeholders after +55: 3 (area) + 9 (number).
 * - IMask with unmask=true returns only those 12 digits in onAccept.
 * - We prepend "55" and "+" so the parent receives full E.164: "+55" + unmaskedValue.
 * - So stored value is always "+55" followed by 12 digits (digits only after the plus).
 */

const BR_PREFIX = '+55'
const MASK_PATTERN = '+55 (000) 00000-0000'
const NATIONAL_DIGITS_LENGTH = 12 // 3 (area) + 9 (number)

export interface PhoneInputMaskedProps
  extends Omit<
    ComponentProps<typeof IMaskInput>,
    'mask' | 'unmask' | 'onAccept' | 'value' | 'onChange'
  > {
  /** E.164 value, e.g. "+5511999999999". Pass empty string to clear. */
  value?: string
  /** Called with E.164 string (e.g. "+5511999999999") or "" when empty. */
  onChange?: (value: string) => void
  onValueChange?: (value: string) => void
}

/**
 * Extracts the 12 national digits from an E.164 or digits-only value for the mask.
 * - "+5511999999999" -> "11999999999" (12 chars)
 * - "5511999999999" or "119999999999" -> normalized to 12 digits (strip leading 55 if present).
 */
function toNationalDigits(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 0) return ''
  const withoutCountry = digits.startsWith('55') ? digits.slice(2) : digits
  return withoutCountry.slice(0, NATIONAL_DIGITS_LENGTH)
}

/**
 * Builds E.164 from 12 national digits: "+55" + digits.
 */
function toE164(nationalDigits: string): string {
  if (nationalDigits.length === 0) return ''
  return BR_PREFIX + nationalDigits
}

const PhoneInputMasked = ({
  className,
  value = '',
  onChange,
  onValueChange,
  ...props
}: PhoneInputMaskedProps) => {
  const nationalDigits = toNationalDigits(value)

  const handleAccept = (unmasked: string) => {
    const e164 = toE164(unmasked)
    onChange?.(e164)
    onValueChange?.(e164)
  }

  const inputProps = {
    mask: MASK_PATTERN,
    unmask: true,
    lazy: false,
    value: nationalDigits,
    onAccept: handleAccept,
    type: 'text' as const,
    inputMode: 'tel' as const,
    autoComplete: 'tel',
    placeholder: MASK_PATTERN,
    'aria-label': 'Telefone (formato: +55 (DDD) XXXXX-XXXX)',
    className: cn(
      'flex h-10 w-full rounded-md border border-input/60 bg-background px-3.5 py-2.5 text-sm ring-offset-background transition-all duration-200',
      'placeholder:text-muted-foreground/60 hover:border-input',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:border-ring',
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30',
      className
    ),
    ...props,
  } as ComponentProps<typeof IMaskInput>

  return <IMaskInput {...inputProps} />
}

PhoneInputMasked.displayName = 'PhoneInputMasked'

export { PhoneInputMasked }
