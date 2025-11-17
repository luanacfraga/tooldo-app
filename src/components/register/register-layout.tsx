'use client'

import { BackgroundEffects } from '@/components/auth/login/background-effects'
import { RegisterHero } from '@/components/auth/register/register-hero'
import { ReactNode } from 'react'

interface RegisterLayoutProps {
  children: ReactNode
  steps: Array<{ id: number; title: string; description: string }>
  currentStep: number
}

export function RegisterLayout({ children, steps, currentStep }: RegisterLayoutProps) {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <BackgroundEffects />
      <RegisterHero steps={steps} currentStep={currentStep} />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:px-12">
        {children}
      </div>
    </div>
  )
}

