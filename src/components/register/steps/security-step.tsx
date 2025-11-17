'use client'

import { FormFieldWrapper } from '@/components/ui/form-field-wrapper'
import { PasswordInput } from '@/components/ui/password-input'
import { type RegisterFormData } from '@/lib/validators/auth'
import { FieldErrors, UseFormRegister } from 'react-hook-form'

interface SecurityStepProps {
  register: UseFormRegister<RegisterFormData>
  errors: FieldErrors<RegisterFormData>
}

export function SecurityStep({ register, errors }: SecurityStepProps) {
  return (
    <div className="space-y-6">
      <FormFieldWrapper
        label="Senha"
        htmlFor="password"
        error={errors.password?.message}
        required
      >
        <PasswordInput
          id="password"
          placeholder="••••••••"
          {...register('password')}
          className={`h-12 text-base transition-all ${
            errors.password
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-input focus-visible:border-primary focus-visible:ring-primary/20'
          }`}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Confirmar Senha"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
        required
      >
        <PasswordInput
          id="confirmPassword"
          placeholder="••••••••"
          {...register('confirmPassword')}
          className={`h-12 text-base transition-all ${
            errors.confirmPassword
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-input focus-visible:border-primary focus-visible:ring-primary/20'
          }`}
        />
      </FormFieldWrapper>
    </div>
  )
}

