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
  funcao?: string
  page: number
  pageSize: number
}

export interface ViagensFilter {
  // Parâmetros OBRIGATÓRIOS da API
  dataIdaDe: string      // DD/MM/AAAA
  dataIdaAte: string     // DD/MM/AAAA
  dataRetornoDe: string  // DD/MM/AAAA
  dataRetornoAte: string // DD/MM/AAAA
  codigoOrgao: string    // Código SIAFI
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