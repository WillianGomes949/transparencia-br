'use server'

import { apiClient, ApiError } from '@/lib/api/client'

interface TestResult {
  endpoint: string
  success: boolean
  message: string
  data?: any
  error?: string
}

export async function testApiConnectionAction(): Promise<{ tests: TestResult[] }> {
  const tests: TestResult[] = []

  // Test 1: Despesas
  try {
    const data = await apiClient<any>({
      endpoint: '/despesas',
      params: { ano: 2026, pagina: 1 },
    })
    tests.push({
      endpoint: '/despesas',
      success: true,
      message: `Retornou ${Array.isArray(data) ? data.length : data?.data?.length || 0} registros`,
      data: Array.isArray(data) ? data.slice(0, 2) : data?.data?.slice(0, 2),
    })
  } catch (error) {
    tests.push({
      endpoint: '/despesas',
      success: false,
      message: error instanceof ApiError ? error.message : 'Erro desconhecido',
      error: error instanceof ApiError ? error.details : undefined,
    })
  }

  // Test 2: Emendas
  try {
    const data = await apiClient<any>({
      endpoint: '/emendas',
      params: { ano: 2026, pagina: 1 },
    })
    tests.push({
      endpoint: '/emendas',
      success: true,
      message: `Retornou ${Array.isArray(data) ? data.length : data?.data?.length || 0} registros`,
      data: Array.isArray(data) ? data.slice(0, 2) : data?.data?.slice(0, 2),
    })
  } catch (error) {
    tests.push({
      endpoint: '/emendas',
      success: false,
      message: error instanceof ApiError ? error.message : 'Erro desconhecido',
      error: error instanceof ApiError ? error.details : undefined,
    })
  }

  // Test 3: Viagens
  try {
    const data = await apiClient<any>({
      endpoint: '/viagens',
      params: { pagina: 1 },
    })
    tests.push({
      endpoint: '/viagens',
      success: true,
      message: `Retornou ${Array.isArray(data) ? data.length : data?.data?.length || 0} registros`,
      data: Array.isArray(data) ? data.slice(0, 2) : data?.data?.slice(0, 2),
    })
  } catch (error) {
    tests.push({
      endpoint: '/viagens',
      success: false,
      message: error instanceof ApiError ? error.message : 'Erro desconhecido',
      error: error instanceof ApiError ? error.details : undefined,
    })
  }

  return { tests }
}