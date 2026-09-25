'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchEmendasAction } from '@/actions/emendas'
import { useFilterStore } from '@/stores/filterStore'

export function useEmendas() {
  const { ano, page } = useFilterStore()

  return useQuery({
    queryKey: ['emendas', ano, page],
    queryFn: () => fetchEmendasAction({ ano, page, pageSize: 20 }),
    staleTime: 5 * 60 * 1000,
  })
}