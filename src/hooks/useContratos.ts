'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchContratosAction } from '@/actions/contratos'
import { useFilterStore } from '@/stores/filterStore'

export function useContratos() {
  const { page } = useFilterStore()

  return useQuery({
    queryKey: ['contratos', page],
    queryFn: () => fetchContratosAction({ page, pageSize: 20 }),
    staleTime: 5 * 60 * 1000,
  })
}