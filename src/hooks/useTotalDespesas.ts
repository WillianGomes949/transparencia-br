'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchTotalDespesasAction } from '@/actions/despesas'
import { useFilterStore } from '@/stores/filterStore'

export function useTotalDespesas() {
  const { ano, orgao } = useFilterStore()

  return useQuery({
    queryKey: ['total-despesas', ano, orgao],
    queryFn: async () => {
      const result = await fetchTotalDespesasAction(ano, orgao || undefined)

      if (!result.success) {
        throw new Error(result.error || 'Erro ao calcular total')
      }

      return result.data!
    },
    staleTime: 5 * 60 * 1000,
  })
}