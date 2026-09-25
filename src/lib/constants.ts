export const API_BASE_URL =
  process.env.NEXT_PUBLIC_PORTAL_API_URL ||
  'https://api.portaldatransparencia.gov.br/api/v1'

export const API_TOKEN = process.env.PORTAL_API_TOKEN

export const DEFAULT_PAGE_SIZE = 20

export const YEARS = Array.from({ length: 10 }, (_, i) => 2026 - i)

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]