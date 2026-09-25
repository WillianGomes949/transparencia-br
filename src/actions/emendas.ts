'use server'

import { apiClient, ApiError } from '@/lib/api/client'
import type { Emenda, PaginatedResponse } from '@/types/api'
import type { EmendasFilter } from '@/types/filters'

export interface ActionResult<T> {
  success: boolean
  data?: T
  error?: string
  errorCode?: string
}

export async function fetchEmendasAction(
  filters: EmendasFilter
): Promise<ActionResult<PaginatedResponse<Emenda>>> {
  try {
    const response = await apiClient<any>({
      endpoint: '/emendas',
      params: {
        ano: filters.ano,
        autor: filters.autor,
        uf: filters.uf,
        pagina: filters.page,
      },
    })

    const emendas = Array.isArray(response) ? response : response.data || []

    return {
      success: true,
      data: {
        data: emendas,
        total: response.totalCount || emendas.length,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        errorCode: error.status === 401 ? 'INVALID_TOKEN' : 'API_ERROR',
      }
    }
    return { success: false, error: 'Erro ao buscar emendas', errorCode: 'UNKNOWN_ERROR' }
  }
}

export async function fetchEmendaByNumeroAction(
  numero: string
): Promise<Emenda | null> {
  try {
    const data = await apiClient<any>({
      endpoint: '/emendas',
      params: { numeroEmenda: numero, pagina: 1 },
    })
    const emendas = Array.isArray(data) ? data : data.data || []
    return emendas[0] || null
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[fetchEmendaByNumeroAction] ${error.message}`)
    }
    return null
  }
}