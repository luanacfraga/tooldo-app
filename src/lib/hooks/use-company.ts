import { useCompanyStore } from '@/lib/stores/company-store'

export function useCompany() {
  const companies = useCompanyStore((state) => state.companies)
  const selectedCompany = useCompanyStore((state) => state.selectedCompany)
  const isLoading = useCompanyStore((state) => state.isLoading)
  const setCompanies = useCompanyStore((state) => state.setCompanies)
  const selectCompany = useCompanyStore((state) => state.selectCompany)
  const addCompany = useCompanyStore((state) => state.addCompany)
  const updateCompany = useCompanyStore((state) => state.updateCompany)
  const removeCompany = useCompanyStore((state) => state.removeCompany)
  const setLoading = useCompanyStore((state) => state.setLoading)
  const clearCompanies = useCompanyStore((state) => state.clearCompanies)

  return {
    companies,
    selectedCompany,
    isLoading,
    setCompanies,
    selectCompany,
    addCompany,
    updateCompany,
    removeCompany,
    setLoading,
    clearCompanies,
  }
}
