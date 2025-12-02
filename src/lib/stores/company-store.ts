import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Company } from '@/lib/api/endpoints/companies'

interface CompanyState {
  // State
  companies: Company[]
  selectedCompany: Company | null
  isLoading: boolean

  // Actions
  setCompanies: (companies: Company[]) => void
  selectCompany: (company: Company | null) => void
  addCompany: (company: Company) => void
  updateCompany: (id: string, updates: Partial<Company>) => void
  removeCompany: (id: string) => void
  setLoading: (isLoading: boolean) => void
  clearCompanies: () => void
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      companies: [],
      selectedCompany: null,
      isLoading: false,

      setCompanies: (companies) => {
        set({ companies })

        // Auto-select first company if none selected and companies exist
        const { selectedCompany } = get()
        if (!selectedCompany && companies.length > 0) {
          set({ selectedCompany: companies[0] })
        }

        // Clear selection if selected company is not in the list
        if (selectedCompany && !companies.find(c => c.id === selectedCompany.id)) {
          set({ selectedCompany: companies[0] || null })
        }
      },

      selectCompany: (company) => {
        set({ selectedCompany: company })
      },

      addCompany: (company) => {
        const { companies } = get()
        set({ companies: [...companies, company] })

        // Auto-select if first company
        if (companies.length === 0) {
          set({ selectedCompany: company })
        }
      },

      updateCompany: (id, updates) => {
        const { companies, selectedCompany } = get()
        const updatedCompanies = companies.map(c =>
          c.id === id ? { ...c, ...updates } : c
        )
        set({ companies: updatedCompanies })

        // Update selected company if it was the one updated
        if (selectedCompany?.id === id) {
          set({ selectedCompany: { ...selectedCompany, ...updates } })
        }
      },

      removeCompany: (id) => {
        const { companies, selectedCompany } = get()
        const filteredCompanies = companies.filter(c => c.id !== id)
        set({ companies: filteredCompanies })

        // Clear or change selection if removed company was selected
        if (selectedCompany?.id === id) {
          set({ selectedCompany: filteredCompanies[0] || null })
        }
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      clearCompanies: () => {
        set({
          companies: [],
          selectedCompany: null,
          isLoading: false,
        })
      },
    }),
    {
      name: 'company-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedCompany: state.selectedCompany,
        // Don't persist companies list, it will be fetched on load
      }),
    }
  )
)
