'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchDespesasAction } from '@/actions/despesas'
import { useFilterStore } from '@/stores/filterStore'

export function useDespesas() {
  const { ano, orgao, mes, page } = useFilterStore()

  return useQuery({
    queryKey: ['despesas', ano, orgao, mes, page],
    queryFn: async () => {
      const result = await fetchDespesasAction({
        ano,
        orgao: orgao || undefined,
        mes,
        page,
        pageSize: 20,
      })

      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar despesas')
      }

      return result.data!
    },
    staleTime: 5 * 60 * 1000,
  })
}