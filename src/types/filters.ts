export interface DespesasFilter {
  orgao?: string
  ano: number
  mes?: number
  funcao?: string
  page: number
  pageSize: number
}

export interface EmendasFilter {
  ano: number
  autor?: string
  uf?: string
  page: number
  pageSize: number
}

export interface ViagensFilter {
  orgao?: string
  dataInicio?: string
  dataFim?: string
  page: number
  pageSize: number
}

export interface ContratosFilter {
  orgao?: string
  dataInicio?: string
  dataFim?: string
  page: number
  pageSize: number
}