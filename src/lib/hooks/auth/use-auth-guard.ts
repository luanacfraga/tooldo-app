'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

import { useAuthStore, type User } from '@/lib/stores/auth-store'
import { config } from '@/config/config'

interface UseAuthGuardOptions {
  redirectTo?: string
  requireAuth?: boolean
}

interface AuthGuardState {
  isChecking: boolean
  isAuthenticated: boolean
  user: User | null
}

/**
 * Hook para gerenciar lógica de autenticação e redirecionamento
 * Responsabilidade única: Verificar estado de autenticação
 *
 * Aplica DIP: Não depende diretamente de implementações, retorna apenas estado
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}): AuthGuardState {
  const { redirectTo = '/login', requireAuth = true } = options
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const token = Cookies.get(config.cookies.tokenName)

    const checkAuth = setTimeout(() => {
      if (!token && !user && requireAuth) {
        router.push(redirectTo)
        return
      }

      if (token && !user) {
        setIsChecking(true)
        return
      }

      setIsChecking(false)
    }, 100)

    return () => clearTimeout(checkAuth)
  }, [user, isAuthenticated, router, redirectTo, requireAuth])

  return {
    isChecking,
    isAuthenticated: !!user,
    user,
  }
}
