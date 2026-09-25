'use server'

import { apiClient, ApiError } from '@/lib/api/client'
import type { Viagem, PaginatedResponse } from '@/types/api'
import type { ViagensFilter } from '@/types/filters'

export interface ActionResult<T> {
  success: boolean
  data?: T
  error?: string
  errorCode?: string
}

export async function fetchViagensAction(
  filters: ViagensFilter
): Promise<ActionResult<PaginatedResponse<Viagem>>> {
  try {
    // Validação: todos os parâmetros de data são obrigatórios
    if (!filters.dataIdaDe || !filters.dataIdaAte || !filters.dataRetornoDe || !filters.dataRetornoAte) {
      return {
        success: false,
        error: 'Parâmetros de data são obrigatórios (dataIdaDe, dataIdaAte, dataRetornoDe, dataRetornoAte)',
        errorCode: 'MISSING_PARAMS',
      }
    }

    // Validação: código do órgão é obrigatório
    if (!filters.codigoOrgao) {
      return {
        success: false,
        error: 'Código do órgão (SIAFI) é obrigatório',
        errorCode: 'MISSING_ORGAO',
      }
    }

    // Validação: período máximo de 1 mês
    const [dayDe, monthDe, yearDe] = filters.dataIdaDe.split('/').map(Number)
    const [dayAte, monthAte, yearAte] = filters.dataIdaAte.split('/').map(Number)
    const startDate = new Date(yearDe, monthDe - 1, dayDe)
    const endDate = new Date(yearAte, monthAte - 1, dayAte)
    const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays > 31) {
      return {
        success: false,
        error: 'Período máximo de 1 mês (31 dias)',
        errorCode: 'PERIOD_TOO_LONG',
      }
    }

    const response = await apiClient<any>({
      endpoint: '/viagens',
      params: {
        dataIdaDe: filters.dataIdaDe,
        dataIdaAte: filters.dataIdaAte,
        dataRetornoDe: filters.dataRetornoDe,
        dataRetornoAte: filters.dataRetornoAte,
        codigoOrgao: filters.codigoOrgao,
        pagina: filters.page,
      },
    })

    const viagens = Array.isArray(response) ? response : response.data || []

    return {
      success: true,
      data: {
        data: viagens,
        total: response.totalCount || viagens.length,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`[fetchViagensAction] ${error.message}`)
      return {
        success: false,
        error: error.message,
        errorCode: error.status === 401 ? 'INVALID_TOKEN' : 'API_ERROR',
      }
    }
    return { success: false, error: 'Erro ao buscar viagens', errorCode: 'UNKNOWN_ERROR' }
  }
}