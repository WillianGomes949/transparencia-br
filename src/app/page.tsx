'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { useDespesas } from '@/hooks/useDespesas'
import { useTotalDespesas } from '@/hooks/useTotalDespesas'
import { Table } from '@/components/ui/Table'
import { formatCurrency } from '@/lib/utils'
import type { Despesa } from '@/types/api'
import { Wallet, AlertCircle } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function HomePage() {
  const { data: despesas, isLoading, error } = useDespesas()
  const { data: total } = useTotalDespesas()

  const columns = [
    {
      key: 'orgao',
      header: 'Órgão',
      render: (row: Despesa) => (
        <span className="font-medium">{row.nomeOrgaoSuperior}</span>
      ),
    },
    {
      key: 'funcao',
      header: 'Função',
      render: (row: Despesa) => row.nomeFuncao,
    },
    {
      key: 'beneficiario',
      header: 'Beneficiário',
      render: (row: Despesa) => row.nomeBeneficiario || '—',
    },
    {
      key: 'data',
      header: 'Data',
      render: (row: Despesa) => row.dataPagamento,
    },
    {
      key: 'valor',
      header: 'Valor',
      className: 'text-right mono',
      render: (row: Despesa) => formatCurrency(row.valor),
    },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-7xl mx-auto"
    >
      <motion.div variants={item}>
        <div className="border-b-2 border-ink pb-4 mb-6">
          <div className="mono text-xs uppercase tracking-widest text-muted mb-2">
            / dashboard
          </div>
          <h1 className="display text-4xl md:text-6xl leading-none">
            GASTOS PÚBLICOS
          </h1>
          <p className="mono text-sm mt-3 text-muted max-w-2xl">
            Dados oficiais do Governo Federal. Atualizados em tempo real via API
            do Portal da Transparência.
          </p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <FilterPanel />
      </motion.div>

      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card
          label="Total em despesas"
          value={isLoading ? '...' : formatCurrency(total ?? 0)}
          hint="Somatório do período filtrado"
        />
        <Card
          label="Registros"
          value={isLoading ? '...' : despesas?.total ?? 0}
          hint="Documentos encontrados"
        />
        <Card
          label="Ticket médio"
          value={
            isLoading
              ? '...'
              : formatCurrency(
                  (total ?? 0) / Math.max(despesas?.total ?? 1, 1)
                )
          }
          hint="Valor médio por documento"
        />
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="display text-2xl flex items-center gap-2">
            <Wallet size={24} />
            Últimas Despesas
          </h2>
          <div className="mono text-xs uppercase tracking-widest text-muted">
            {despesas?.total ?? 0} registros
          </div>
        </div>

        {error && (
          <div className="brutal-border p-4 bg-paper flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="mono text-sm">
              Falha ao carregar dados. Verifique sua conexão.
            </span>
          </div>
        )}

        <Table
          columns={columns}
          data={despesas?.data ?? []}
          keyExtractor={(row) =>
            `${row.numeroDocumento}-${row.dataPagamento}-${row.codigoBeneficiario}`
          }
          emptyMessage="Nenhuma despesa encontrada para o filtro selecionado"
        />
      </motion.div>

      <motion.div variants={item} className="mono text-[10px] text-muted pt-4 border-t border-ink">
        <p>
          DADOS: PORTAL DA TRANSPARÊNCIA — API DE DADOS DO GOVERNO FEDERAL.
          ATUALIZAÇÃO AUTOMÁTICA A CADA 5 MINUTOS.
        </p>
      </motion.div>
    </motion.div>
  )
}