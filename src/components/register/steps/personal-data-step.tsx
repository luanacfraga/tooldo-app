'use client'

import { FormFieldWrapper } from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { type RegisterFormData } from '@/lib/validators/auth'
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

interface PersonalDataStepProps {
  register: UseFormRegister<RegisterFormData>
  errors: FieldErrors<RegisterFormData>
  setValue: UseFormSetValue<RegisterFormData>
  watch: UseFormWatch<RegisterFormData>
}

export function PersonalDataStep({
  register,
  errors,
  setValue,
  watch,
}: PersonalDataStepProps) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormFieldWrapper
          label="Nome"
          htmlFor="firstName"
          error={errors.firstName?.message}
          required
        >
          <Input
            id="firstName"
            type="text"
            placeholder="João"
            {...register('firstName')}
            className={`h-12 text-base transition-all ${
              errors.firstName
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-input focus-visible:border-primary focus-visible:ring-primary/20'
            }`}
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Sobrenome"
          htmlFor="lastName"
          error={errors.lastName?.message}
          required
        >
          <Input
            id="lastName"
            type="text"
            placeholder="Silva"
            {...register('lastName')}
            className={`h-12 text-base transition-all ${
              errors.lastName
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-input focus-visible:border-primary focus-visible:ring-primary/20'
            }`}
          />
        </FormFieldWrapper>
      </div>

      <FormFieldWrapper label="Email" htmlFor="email" error={errors.email?.message} required>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
          className={`h-12 text-base transition-all ${
            errors.email
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-input focus-visible:border-primary focus-visible:ring-primary/20'
          }`}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="Telefone" htmlFor="phone" error={errors.phone?.message} required>
        <PhoneInput
          id="phone"
          value={watch('phone') ?? ''}
          onChange={(value) => setValue('phone', value, { shouldValidate: true })}
          onBlur={register('phone').onBlur}
          className={`h-12 text-base transition-all ${
            errors.phone
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-input focus-visible:border-primary focus-visible:ring-primary/20'
          }`}
        />
      </FormFieldWrapper>
    </div>
  )
}

