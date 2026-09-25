'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchViagensAction } from '@/actions/viagens'
import { useFilterStore } from '@/stores/filterStore'

export function useViagens() {
  const { page, dataIdaDe, dataIdaAte, dataRetornoDe, dataRetornoAte, codigoOrgao } = useFilterStore()

  return useQuery({
    queryKey: ['viagens', dataIdaDe, dataIdaAte, dataRetornoDe, dataRetornoAte, codigoOrgao, page],
    queryFn: async () => {
      const result = await fetchViagensAction({
        dataIdaDe,
        dataIdaAte,
        dataRetornoDe,
        dataRetornoAte,
        codigoOrgao,
        page,
        pageSize: 20,
      })
      if (!result.success) {
        throw new Error(result.error || 'Erro ao buscar viagens')
      }
      return result.data!
    },
    staleTime: 5 * 60 * 1000,
  })
}