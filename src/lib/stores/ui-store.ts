import { create } from 'zustand'

interface UIState {
  isMobileMenuOpen: boolean
  openMobileMenu: () => void
  closeMobileMenu: () => void
  toggleMobileMenu: () => void
  isWebMenuCollapsed: boolean
  expandWebMenu: () => void
  collapseWebMenu: () => void
  toggleWebMenu: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  isWebMenuCollapsed: false,
  expandWebMenu: () => set({ isWebMenuCollapsed: false }),
  collapseWebMenu: () => set({ isWebMenuCollapsed: true }),
  toggleWebMenu: () => set((state) => ({ isWebMenuCollapsed: !state.isWebMenuCollapsed })),
}))
