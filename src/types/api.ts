export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// ========== DESPESAS ==========
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

// ========== EMENDAS ==========
export interface Emenda {
  codigoEmenda: string
  ano: number
  tipoEmenda: string
  autor: string
  nomeAutor: string
  numeroEmenda: string
  localidadeDoGasto: string
  funcao: string
  subfuncao: string
  // Valores vêm como string na API (ex: "1500000,00")
  valorEmpenhado: string
  valorLiquidado: string
  valorPago: string
  valorRestoInscrito: string
  valorRestoCancelado: string
  valorRestoPago: string
}

// ========== VIAGENS ==========
export interface OrgaoMaximo {
  codigo: string
  sigla: string
  nome: string
}

export interface OrgaoInfo {
  nome: string
  codigoSIAFI: string
  cnpj: string
  sigla: string
  descricaoPoder: string
  orgaoMaximo: OrgaoMaximo
}

export interface UnidadeGestora {
  codigo: string
  nome: string
  descricaoPoder: string
  orgaoVinculado: {
    codigoSIAFI: string
    cnpj: string
    sigla: string
    nome: string
  }
  orgaoMaximo: OrgaoMaximo
}

export interface ViagemInfo {
  motivo: string
  pcdp: string
  ano: number
  numPcdp: string
  justificativaUrgente: string
  urgenciaViagem: string
}

export interface Beneficiario {
  cpfFormatado: string
  nis: string
  nome: string
}

export interface CargoInfo {
  codigoSIAPE: string
  descricao: string
}

export interface Viagem {
  id: number
  viagem: ViagemInfo
  situacao: string
  beneficiario: Beneficiario
  cargo: CargoInfo
  funcao: CargoInfo
  tipoViagem: string
  orgao: OrgaoInfo
  orgaoPagamento: OrgaoInfo
  unidadeGestoraResponsavel: UnidadeGestora
  dataInicioAfastamento: string
  dataFimAfastamento: string
  valorTotalRestituicao: number
  valorTotalTaxaAgenciamento: number
  valorMulta: number
  valorTotalDiarias: number
  valorTotalPassagem: number
  valorTotalViagem: number
  valorTotalDevolucao: number
}

// ========== CONTRATOS ==========
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