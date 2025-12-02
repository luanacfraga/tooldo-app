'use client'

import { config } from '@/config/index'
import { useAuthStore } from '@/lib/stores/auth-store'
import Cookies from 'js-cookie'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AdminOnlyProps {
  children: React.ReactNode
  fallbackPath?: string
}

/**
 * Component that ensures only users with 'admin' role can access its children.
 * Redirects non-admin users to the fallback path.
 */
export function AdminOnly({ children, fallbackPath = '/dashboard' }: AdminOnlyProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
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

      // If authenticated but not admin, redirect to fallback
      if (user && user.role !== 'admin') {
        router.push(fallbackPath)
      }
    }, 100)

    return () => clearTimeout(checkAuth)
  }, [user, isAuthenticated, router, fallbackPath])

  // Show loading while checking or if Zustand hasn't hydrated yet
  if (isChecking || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-base" />
          <p className="mt-4 text-sm text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Don't render if not admin
  if (user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-base" />
          <p className="mt-4 text-sm text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    )
  }

  // User is admin, render children
  return <>{children}</>
}
