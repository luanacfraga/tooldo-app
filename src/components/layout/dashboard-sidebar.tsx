'use client'

import { Sidebar, type MenuItem } from './sidebar'
import { useAuth } from '@/lib/hooks/use-auth'
import { Home, Users, Settings } from 'lucide-react'
import { useMemo } from 'react'

export function DashboardSidebar() {
  const { logout } = useAuth()

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
      },
      {
        name: 'Usuários',
        href: '/users',
        icon: Users,
      },
      {
        name: 'Configurações',
        href: '/settings',
        icon: Settings,
      },
    ],
    []
  )

  return <Sidebar items={menuItems} onLogout={logout} showLogout={true} />
}

