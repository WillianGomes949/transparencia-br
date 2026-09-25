'use server'

import { apiClient, ApiError } from '@/lib/api/client'
import type { Despesa, Emenda } from '@/types/api'

export interface BuscaResult {
  despesas: Despesa[]
  emendas: Emenda[]
  total: number
}

export async function buscaGlobalAction(query: string): Promise<BuscaResult> {
  if (!query || query.trim().length < 3) {
    return { despesas: [], emendas: [], total: 0 }
  }

  try {
    const [despesas, emendas] = await Promise.allSettled([
      apiClient<Despesa[]>({
        endpoint: '/despesas',
        params: { nomeBeneficiario: query, pagina: 1 },
      }),
      apiClient<Emenda[]>({
        endpoint: '/emendas',
        params: { autor: query, pagina: 1 },
      }),
    ])

    const d = despesas.status === 'fulfilled' ? despesas.value || [] : []
    const e = emendas.status === 'fulfilled' ? emendas.value || [] : []

    return {
      despesas: d.slice(0, 5),
      emendas: e.slice(0, 5),
      total: d.length + e.length,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[buscaGlobalAction] ${error.message}`)
    }
    return { despesas: [], emendas: [], total: 0 }
  }
}