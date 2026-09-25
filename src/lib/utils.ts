export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

/**
 * Converte string monetária da API (ex: "1500000,00" ou "1.500.000,00") para number.
 * A API do Portal da Transparência retorna valores como string com vírgula decimal.
 */
export function parseCurrency(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return value

  // Remove pontos de milhar e substitui vírgula por ponto
  const cleaned = value
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '')

  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export function formatDate(dateString: string): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}