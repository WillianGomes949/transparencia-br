'use server'

import { apiClient, ApiError } from '@/lib/api/client'
import type { Despesa, PaginatedResponse } from '@/types/api'
import type { DespesasFilter } from '@/types/filters'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants'

export async function fetchDespesasAction(
  filters: DespesasFilter
): Promise<PaginatedResponse<Despesa>> {
  try {
    const data = await apiClient<Despesa[]>({
      endpoint: '/despesas',
      params: {
        codigoOrgaoSuperior: filters.orgao,
        ano: filters.ano,
        mes: filters.mes,
        codigoFuncao: filters.funcao,
        pagina: filters.page,
      },
    })

    return {
      data: data || [],
      total: data?.length || 0,
      page: filters.page,
      pageSize: filters.pageSize || DEFAULT_PAGE_SIZE,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[fetchDespesasAction] ${error.endpoint}: ${error.message}`)
    }
    return { data: [], total: 0, page: filters.page, pageSize: filters.pageSize }
  }
}

export async function fetchTotalDespesasAction(
  ano: number,
  orgao?: string
): Promise<number> {
  try {
    const data = await apiClient<Despesa[]>({
      endpoint: '/despesas',
      params: { ano, codigoOrgaoSuperior: orgao },
    })
    return (data || []).reduce((sum, d) => sum + (d.valor || 0), 0)
  } catch {
    return 0
  }
}