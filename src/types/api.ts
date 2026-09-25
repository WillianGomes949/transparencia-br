export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface Despesa {
  codigoOrgaoSuperior: string
  nomeOrgaoSuperior: string
  codigoOrgao: string
  nomeOrgao: string
  codigoUnidadeOrcamentaria: string
  nomeUnidadeOrcamentaria: string
  codigoFuncao: string
  nomeFuncao: string
  codigoSubfuncao: string
  nomeSubfuncao: string
  codigoPrograma: string
  nomePrograma: string
  codigoAcao: string
  nomeAcao: string
  codigoElementoDespesa: string
  nomeElementoDespesa: string
  codigoBeneficiario: string
  nomeBeneficiario: string
  numeroDocumento: string
  tipoDocumento: string
  dataPagamento: string
  valor: number
  codigoMunicipioIBGE: string
  nomeMunicipioUF: string
  fonteFinalidade: string
}

export interface Emenda {
  numeroEmenda: string
  ano: number
  tipo: string
  autor: string
  partidoAutor: string
  ufAutor: string
  localidade: string
  valorEmpenhado: number
  valorLiquidado: number
  valorPago: number
  valorAPagar: number
  situacao: string
}

export interface Viagem {
  orgao: string
  cpf: string
  nome: string
  cargo: string
  motivo: string
  dataInicio: string
  dataFim: string
  destino: string
  valorDiarias: number
  valorPassagens: number
}

export interface Contrato {
  numero: string
  objeto: string
  orgao: string
  contratado: string
  cnpj: string
  valor: number
  dataInicio: string
  dataFim: string
  situacao: string
}