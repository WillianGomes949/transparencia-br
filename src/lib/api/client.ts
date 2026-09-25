import { API_BASE_URL, API_TOKEN } from '../constants'

export interface ApiRequestOptions {
  endpoint: string
  params?: Record<string, string | number | undefined>
  headers?: Record<string, string>
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public endpoint: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiClient<T>({
  endpoint,
  params,
  headers = {},
}: ApiRequestOptions): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value))
      }
    })
  }

  console.log(`[API] Request: ${url.toString()}`)

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      'chave-api-dados': API_TOKEN || '',
      ...headers,
    },
    next: { revalidate: 300 },
  })

  console.log(`[API] Response status: ${response.status}`)

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`[API] Error response:`, errorText)
    
    let errorMessage = `Erro ${response.status}: ${response.statusText}`
    if (response.status === 401) {
      errorMessage = 'Token de API inválido ou ausente. Configure PORTAL_API_TOKEN no .env.local'
    } else if (response.status === 403) {
      errorMessage = 'Acesso negado. Verifique seu token.'
    } else if (response.status === 429) {
      errorMessage = 'Limite de requisições excedido. Aguarde alguns segundos.'
    }

    throw new ApiError(response.status, errorMessage, endpoint, errorText)
  }

  const data = await response.json()
  console.log(`[API] Response data:`, data)
  
  return data
}