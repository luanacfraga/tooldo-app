'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { companiesApi } from '@/lib/api/endpoints/companies'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useCompanyStore } from '@/lib/stores/company-store'
import { Building2, Plus, Settings, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompanySelectorProps {
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'compact'
}

export function CompanySelector({
  className,
  showLabel = true,
  variant = 'default',
}: CompanySelectorProps) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const {
    companies,
    selectedCompany,
    setCompanies,
    selectCompany,
    isLoading,
    setLoading,
  } = useCompanyStore()
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const loadCompanies = async () => {
      // Only load for admin users
      if (user?.role !== 'admin') return

      try {
        setLoading(true)
        setLoadError(false)
        const data = await companiesApi.getMyCompanies()
        setCompanies(data || [])
      } catch (err) {
        console.error('Error loading companies:', err)
        setLoadError(true)
      } finally {
        setLoading(false)
      }
    }

    // Only load if we don't have companies yet and user is admin
    if (companies.length === 0 && user?.role === 'admin') {
      loadCompanies()
    }
  }, [user?.role, companies.length, setCompanies, setLoading])

  // Don't render anything if user is not admin
  if (!user || user.role !== 'admin') {
    return null
  }

  const handleCompanyChange = (companyId: string) => {
    if (companyId === 'new') {
      router.push('/companies/new')
      return
    }

    if (companyId === 'manage') {
      router.push('/companies')
      return
    }

    const company = companies.find((c) => c.id === companyId)
    if (company) {
      selectCompany(company)
    }
  }

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        {showLabel && variant === 'default' && (
          <span className="text-sm text-muted-foreground">Carregando...</span>
        )}
      </div>
    )
  }

  if (loadError) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/companies')}
          className="w-full justify-start"
        >
          <Building2 className="mr-2 h-4 w-4 text-danger-base" />
          <span className="text-danger-base">Erro ao carregar</span>
        </Button>
      </div>
    )
  }

  if (companies.length === 0) {
    return (
      <div className={cn('space-y-2', className)}>
        {showLabel && variant === 'default' && (
          <label className="text-xs font-medium text-muted-foreground">
            Empresa
          </label>
        )}
        <Button
          variant="outline"
          size={variant === 'compact' ? 'sm' : 'default'}
          onClick={() => router.push('/companies/new')}
          className="w-full justify-start"
        >
          <Plus className="mr-2 h-4 w-4" />
          Criar Primeira Empresa
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && variant === 'default' && (
        <label className="text-xs font-medium text-muted-foreground">
          Empresa Atual
        </label>
      )}
      <div className="flex gap-2">
        <Select
          value={selectedCompany?.id || ''}
          onValueChange={handleCompanyChange}
        >
          <SelectTrigger
            className={cn(
              'flex-1',
              variant === 'compact' && 'h-9 text-sm'
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Building2 className="h-4 w-4 flex-shrink-0 text-primary-base" />
              <SelectValue placeholder="Selecione uma empresa">
                {selectedCompany ? (
                  <span className="truncate">{selectedCompany.name}</span>
                ) : (
                  'Selecione uma empresa'
                )}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{company.name}</span>
                </div>
              </SelectItem>
            ))}
            <div className="my-1 border-t" />
            <SelectItem value="new" className="text-primary-base">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="font-medium">Nova Empresa</span>
              </div>
            </SelectItem>
            <SelectItem value="manage">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Gerenciar Empresas</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        {variant === 'default' && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/companies')}
            title="Gerenciar empresas"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
