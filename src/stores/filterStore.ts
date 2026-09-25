'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FilterState {
  ano: number
  orgao: string
  mes?: number
  page: number
  setAno: (ano: number) => void
  setOrgao: (orgao: string) => void
  setMes: (mes: number | undefined) => void
  setPage: (page: number) => void
  reset: () => void
}

const DEFAULT_STATE = {
  ano: 2026,
  orgao: '',
  mes: undefined,
  page: 1,
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setAno: (ano) => set({ ano, page: 1 }),
      setOrgao: (orgao) => set({ orgao, page: 1 }),
      setMes: (mes) => set({ mes, page: 1 }),
      setPage: (page) => set({ page }),
      reset: () => set(DEFAULT_STATE),
    }),
    { name: 'pt-filters' }
  )
)