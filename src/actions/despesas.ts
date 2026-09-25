'use server'

import { apiClient, ApiError } from '@/lib/api/client'
import type { Despesa, PaginatedResponse } from '@/types/api'
import type { DespesasFilter } from '@/types/filters'
import { DEFAULT_PAGE_SIZE, CURRENT_YEAR } from '@/lib/constants'

export interface ActionResult<T> {
  success: boolean
  data?: T
  error?: string
  errorCode?: string
}

export async function fetchDespesasAction(
  filters: DespesasFilter
): Promise<ActionResult<PaginatedResponse<Despesa>>> {
  try {
    const ano = Math.min(filters.ano, CURRENT_YEAR)

    // ENDPOINT CORRETO: /api-de-dados/despesas/por-orgao
    const response = await apiClient<any>({
      endpoint: '/despesas/por-orgao',
      params: {
        codigoOrgaoSuperior: filters.orgao,
        ano,
        mes: filters.mes,
        codigoFuncao: filters.funcao,
        pagina: filters.page,
      },
    })

    const despesas = Array.isArray(response) ? response : response.data || []

    return {
      success: true,
      data: {
        data: despesas,
        total: response.totalCount || despesas.length,
        page: filters.page,
        pageSize: filters.pageSize || DEFAULT_PAGE_SIZE,
      },
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[fetchDespesasAction] ${error.endpoint}: ${error.message}`)
      return {
        success: false,
        error: error.message,
        errorCode: error.status === 401 ? 'INVALID_TOKEN' : error.status === 403 ? 'FORBIDDEN' : 'API_ERROR',
      }
    }
    return { success: false, error: 'Erro desconhecido ao buscar despesas', errorCode: 'UNKNOWN_ERROR' }
  }
}

export async function fetchTotalDespesasAction(
  ano: number,
  orgao?: string
): Promise<ActionResult<number>> {
  try {
    const safeAno = Math.min(ano, CURRENT_YEAR)
    const response = await apiClient<any>({
      endpoint: '/api-de-dados/despesas/por-orgao',
      params: { ano: safeAno, codigoOrgaoSuperior: orgao },
    })

    const despesas = Array.isArray(response) ? response : response.data || []
    const total = despesas.reduce((sum: number, d: any) => sum + (d.valor || 0), 0)

    return { success: true, data: total }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        errorCode: error.status === 401 ? 'INVALID_TOKEN' : 'API_ERROR',
      }
    }
    return { success: false, error: 'Erro ao calcular total', errorCode: 'UNKNOWN_ERROR' }
  }
}