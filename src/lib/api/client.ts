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
    public endpoint: string
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

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      'chave-api-dados': API_TOKEN || '',
      ...headers,
    },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Erro na API: ${response.statusText}`,
      endpoint
    )
  }

  return response.json()
}