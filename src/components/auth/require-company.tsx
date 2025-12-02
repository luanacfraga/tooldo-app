'use client'

import { Button } from '@/components/ui/button'
import { config } from '@/config/index'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useCompanyStore } from '@/lib/stores/company-store'
import Cookies from 'js-cookie'
import { Building2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface RequireCompanyProps {
  children: React.ReactNode
}

/**
 * Component that ensures the user has selected a company before accessing content.
 * Only applies to admin users. Other roles see content normally.
 * Redirects admin users without selected company to /select-company
 */
export function RequireCompany({ children }: RequireCompanyProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const selectedCompany = useCompanyStore((state) => state.selectedCompany)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if token exists in cookie (more reliable than Zustand state on initial load)
    const token = Cookies.get(config.cookies.tokenName)

    // Give Zustand a moment to hydrate from localStorage
    const checkAuth = setTimeout(() => {
      // If no token and no user, redirect to login
      if (!token && !user) {
        router.push('/login')
        return
      }

      // If we have token but Zustand hasn't hydrated yet, wait a bit more
      if (token && !user) {
        setIsChecking(true)
        return
      }

      setIsChecking(false)

      // Only admins need to have a company selected
      if (user?.role === 'admin' && !selectedCompany) {
        router.push('/select-company')
      }
    }, 100)

    return () => clearTimeout(checkAuth)
  }, [user, isAuthenticated, selectedCompany, router])

  // Show loading while checking or if Zustand hasn't hydrated yet
  if (isChecking || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-base" />
          <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // If admin without company, show friendly message while redirecting
  if (user.role === 'admin' && !selectedCompany) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-lightest/30 via-background to-secondary-lightest/30 p-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-lightest">
            <Building2 className="h-10 w-10 text-primary-base" />
          </div>
          <h2 className="text-2xl font-bold">Selecione uma Empresa</h2>
          <p className="mt-3 text-muted-foreground">
            Para continuar, você precisa selecionar qual empresa deseja administrar.
          </p>
          <Button onClick={() => router.push('/select-company')} className="mt-6" size="lg">
            Selecionar Empresa
          </Button>
        </div>
      </div>
    )
  }

  // User is authenticated and (not admin OR has company selected)
  return <>{children}</>
}
