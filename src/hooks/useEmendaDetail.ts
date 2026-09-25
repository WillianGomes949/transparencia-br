'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchEmendaByNumeroAction } from '@/actions/emendas'

export function useEmendaDetail(numero: string) {
  return useQuery({
    queryKey: ['emenda', numero],
    queryFn: () => fetchEmendaByNumeroAction(numero),
    enabled: !!numero,
    staleTime: 10 * 60 * 1000,
  })
}