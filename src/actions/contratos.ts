'use server'

import { apiClient, ApiError } from '@/lib/api/client'
import type { Contrato, PaginatedResponse } from '@/types/api'
import type { ContratosFilter } from '@/types/filters'

export async function fetchContratosAction(
  filters: ContratosFilter
): Promise<PaginatedResponse<Contrato>> {
  try {
    const data = await apiClient<Contrato[]>({
      endpoint: '/contratos',
      params: {
        codigoOrgao: filters.orgao,
        dataInicio: filters.dataInicio,
        dataFim: filters.dataFim,
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
      console.error(`[fetchContratosAction] ${error.message}`)
    }
    return { data: [], total: 0, page: filters.page, pageSize: filters.pageSize }
  }
}