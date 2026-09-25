'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchTotalDespesasAction } from '@/actions/despesas'
import { useFilterStore } from '@/stores/filterStore'

export function useTotalDespesas() {
  const { ano, orgao } = useFilterStore()

  return useQuery({
    queryKey: ['total-despesas', ano, orgao],
    queryFn: () => fetchTotalDespesasAction(ano, orgao || undefined),
    staleTime: 5 * 60 * 1000,
  })
}