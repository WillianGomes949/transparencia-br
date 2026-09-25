'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CURRENT_YEAR, getDefaultViagemDateRange, DEFAULT_ORGAO_SIAFI } from '@/lib/constants'

interface FilterState {
  ano: number
  orgao: string
  mes?: number
  page: number
  // Campos de data para viagens (formato DD/MM/AAAA)
  dataIdaDe: string
  dataIdaAte: string
  dataRetornoDe: string
  dataRetornoAte: string
  codigoOrgao: string
  setAno: (ano: number) => void
  setOrgao: (orgao: string) => void
  setMes: (mes: number | undefined) => void
  setPage: (page: number) => void
  setDataIdaDe: (date: string) => void
  setDataIdaAte: (date: string) => void
  setDataRetornoDe: (date: string) => void
  setDataRetornoAte: (date: string) => void
  setCodigoOrgao: (codigo: string) => void
  reset: () => void
}

const defaultDates = getDefaultViagemDateRange()

const DEFAULT_STATE = {
  ano: CURRENT_YEAR,
  orgao: '',
  mes: undefined,
  page: 1,
  dataIdaDe: defaultDates.dataIdaDe,
  dataIdaAte: defaultDates.dataIdaAte,
  dataRetornoDe: defaultDates.dataRetornoDe,
  dataRetornoAte: defaultDates.dataRetornoAte,
  codigoOrgao: DEFAULT_ORGAO_SIAFI,
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setAno: (ano) => set({ ano, page: 1 }),
      setOrgao: (orgao) => set({ orgao, page: 1 }),
      setMes: (mes) => set({ mes, page: 1 }),
      setPage: (page) => set({ page }),
      setDataIdaDe: (dataIdaDe) => set({ dataIdaDe, page: 1 }),
      setDataIdaAte: (dataIdaAte) => set({ dataIdaAte, page: 1 }),
      setDataRetornoDe: (dataRetornoDe) => set({ dataRetornoDe, page: 1 }),
      setDataRetornoAte: (dataRetornoAte) => set({ dataRetornoAte, page: 1 }),
      setCodigoOrgao: (codigoOrgao) => set({ codigoOrgao, page: 1 }),
      reset: () => set(DEFAULT_STATE),
    }),
    { name: 'pt-filters' }
  )
)