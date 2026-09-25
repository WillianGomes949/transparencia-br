export const API_BASE_URL =
  process.env.NEXT_PUBLIC_PORTAL_API_URL ||
  "https://api.portaldatransparencia.gov.br/api-de-dados";

export const API_TOKEN = process.env.PORTAL_API_TOKEN;

export const DEFAULT_PAGE_SIZE = 20;

export const CURRENT_YEAR = new Date().getFullYear();

export const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

export const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Formata data para DD/MM/AAAA (formato da API)
export function formatDateForApi(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Retorna período padrão para viagens (últimos 30 dias, máximo 1 mês)
export function getDefaultViagemDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);

  return {
    dataIdaDe: formatDateForApi(start),
    dataIdaAte: formatDateForApi(end),
    dataRetornoDe: formatDateForApi(start),
    dataRetornoAte: formatDateForApi(end),
  };
}

// Código de órgão padrão (Ministério da Educação = 26000)
// Lista completa: https://api.portaldatransparencia.gov.br/api-de-dados/orgaos
export const DEFAULT_ORGAO_SIAFI = "26000";
