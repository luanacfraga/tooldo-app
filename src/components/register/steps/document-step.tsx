'use client'

import { FormFieldWrapper } from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { maskCNPJ, unmaskCNPJ } from '@/lib/utils/masks'
import { type RegisterFormData } from '@/lib/validators/auth'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'

interface DocumentStepProps {
  register: UseFormRegister<RegisterFormData>
  errors: FieldErrors<RegisterFormData>
  setValue: UseFormSetValue<RegisterFormData>
  cnpjValue: string
  setCnpjValue: (value: string) => void
}

export function DocumentStep({
  register,
  errors,
  setValue,
  cnpjValue,
  setCnpjValue,
}: DocumentStepProps) {
  return (
    <div className="space-y-6">
      <FormFieldWrapper
        label="CNPJ da Empresa"
        htmlFor="document"
        error={errors.document?.message}
        required
      >
        <Input
          id="document"
          type="text"
          placeholder="00.000.000/0001-00"
          maxLength={18}
          value={cnpjValue}
          onChange={(e) => {
            const unmasked = unmaskCNPJ(e.target.value)
            const masked = maskCNPJ(unmasked)
            setCnpjValue(masked)
            setValue('document', unmasked, { shouldValidate: true })
          }}
          onBlur={register('document').onBlur}
          className={`h-12 text-base transition-all ${
            errors.document
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-input focus-visible:border-primary focus-visible:ring-primary/20'
          }`}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Digite o CNPJ completo da sua empresa (14 dígitos)
        </p>
      </FormFieldWrapper>
    </div>
  )
}

