'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchEmendasAction } from '@/actions/emendas'
import { useFilterStore } from '@/stores/filterStore'

export function useEmendas() {
  const { ano, page } = useFilterStore()

  return useQuery({
    queryKey: ['emendas', ano, page],
    queryFn: async () => {
      const result = await fetchEmendasAction({ ano, page, pageSize: 20 })
      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar emendas')
      }
      return result.data!
    },
    staleTime: 5 * 60 * 1000,
  })
}