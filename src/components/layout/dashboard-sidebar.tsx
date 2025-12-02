'use client'

import { CompanySelector } from '@/components/company/company-selector'
import { useAuth } from '@/lib/hooks/use-auth'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Home, Settings, UserPlus, Users, UsersRound } from 'lucide-react'
import { useMemo } from 'react'
import { Sidebar, type MenuItem } from './sidebar'

export function DashboardSidebar() {
  const { logout, user } = useAuth()
  const userFromStore = useAuthStore((state) => state.user)
  const currentUser = user || userFromStore

  // Debug: log user info
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('DashboardSidebar - User:', currentUser)
    console.log('DashboardSidebar - User role:', currentUser?.role)
  }

  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
      },
    ]

    // Menu items para Admin
    const userRole = currentUser?.role
    if (userRole === 'admin') {
      items.push(
        {
          name: 'Convidar Funcionário',
          href: '/invite-employee',
          icon: UserPlus,
        },
        {
          name: 'Funcionários',
          href: '/employees',
          icon: UsersRound,
        },
        {
          name: 'Equipes',
          href: '/teams',
          icon: Users,
        }
      )
    }

    // Menu items para Manager
    if (userRole === 'manager') {
      items.push(
        {
          name: 'Convidar Funcionário',
          href: '/invite-employee',
          icon: UserPlus,
        },
        {
          name: 'Funcionários',
          href: '/employees',
          icon: UsersRound,
        },
        {
          name: 'Equipes',
          href: '/teams',
          icon: Users,
        }
      )
    }

    // Menu items para Master
    if (currentUser?.role === 'master') {
      items.push({
        name: 'Planos',
        href: '/plans',
        icon: Settings,
      })
    }

    items.push({
      name: 'Configurações',
      href: '/settings',
      icon: Settings,
    })

    return items
  }, [currentUser?.role])

  // Show company selector ONLY for admin (not for manager)
  const showCompanySelector = currentUser?.role === 'admin'

  return (
    <Sidebar
      items={menuItems}
      onLogout={logout}
      showLogout={true}
      topComponent={
        showCompanySelector ? (
          <div className="px-4">
            <CompanySelector variant="default" showLabel={true} />
          </div>
        ) : undefined
      }
    />
  )
}
