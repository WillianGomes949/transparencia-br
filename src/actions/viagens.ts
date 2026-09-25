'use server'

import { apiClient, ApiError } from '@/lib/api/client'
import type { Viagem, PaginatedResponse } from '@/types/api'
import type { ViagensFilter } from '@/types/filters'

export async function fetchViagensAction(
  filters: ViagensFilter
): Promise<PaginatedResponse<Viagem>> {
  try {
    const data = await apiClient<Viagem[]>({
      endpoint: '/viagens',
      params: {
        orgao: filters.orgao,
        periodoDataInicio: filters.dataInicio,
        periodoDataFim: filters.dataFim,
        pagina: filters.page,
      },
    })

    return {
      data: data || [],
      total: data?.length || 0,
      page: filters.page,
      pageSize: filters.pageSize,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[fetchViagensAction] ${error.message}`)
    }
    return { data: [], total: 0, page: filters.page, pageSize: filters.pageSize }
  }
}