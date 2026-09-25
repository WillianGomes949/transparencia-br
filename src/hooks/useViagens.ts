'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchViagensAction } from '@/actions/viagens'
import { useFilterStore } from '@/stores/filterStore'

export function useViagens() {
  const { page } = useFilterStore()

  return useQuery({
    queryKey: ['viagens', page],
    queryFn: () => fetchViagensAction({ page, pageSize: 20 }),
    staleTime: 5 * 60 * 1000,
  })
}