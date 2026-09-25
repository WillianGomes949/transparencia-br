'use server'

import { apiClient, ApiError } from '@/lib/api/client'
import type { Emenda, PaginatedResponse } from '@/types/api'
import type { EmendasFilter } from '@/types/filters'

export async function fetchEmendasAction(
  filters: EmendasFilter
): Promise<PaginatedResponse<Emenda>> {
  try {
    const data = await apiClient<Emenda[]>({
      endpoint: '/emendas',
      params: {
        ano: filters.ano,
        autor: filters.autor,
        uf: filters.uf,
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
      console.error(`[fetchEmendasAction] ${error.message}`)
    }
    return { data: [], total: 0, page: filters.page, pageSize: filters.pageSize }
  }
}